import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import { bindActionCreators } from "redux";
import { combine, withHistory, withModulesManager, historyPush, ProgressOrError } from "@openimis/fe-core";
import { styled } from "@mui/material/styles";
import { ErrorBoundary, useTranslations } from "@openimis/fe-core";
import PricelistForm from "../components/PricelistForm";
import {
  createItemsPricelist,
  updateItemsPricelist,
  fetchItemsPricelistById,
  fetchItemsPricelistDetails,
} from "../actions";
import { RIGHT_ITEMS_PRICELISTS_EDIT } from "../constants";

const StyledItemsPriceListDetailsPage = styled('div')(({ theme }) => ({
  ...theme.page ?? {},
  '&.locked': theme.page?.locked ?? {},
}));
import { formatGraphQLFilters } from "../utils";

const ItemsPriceListDetailsPage = (props) => {
  const {
    isFetching,
    error,
    match,
    history,
    modulesManager,
    rights,
    updateItemsPricelist,
    fetchItemsPricelistById,
    fetchItemsPricelistDetails,
    createItemsPricelist,
    details,
  } = props;
  const { formatMessageWithValues } = useTranslations("medical_pricelist", modulesManager);
  const [isLocked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(null);
  const [pricelist, setPricelist] = useState({});
  const [filters, setFilters] = useState([])

  useEffect(() => {
    if (match.params.price_list_id) {
      fetchItemsPricelistById(modulesManager, match.params.price_list_id);
    } else {
      setPricelist({});
    }
  }, [match.params.price_list_id, resetKey]);

  useEffect(() => {
    if (props.pricelist) {
      setPricelist(props.pricelist);
    }
  }, [props.pricelist]);

  useEffect(() => {
    if (filters.length > 0) {
      fetchDetails();
    }
  }, [filters]);

  const onChangeFilters = (newFilters) => {
    setFilters(prevFilters => {
      const updatedFilters = [...prevFilters];

      newFilters.forEach(newFilter => {
        const existingIndex = updatedFilters.findIndex(f => f.id === newFilter.id);

        if (existingIndex >= 0) {
          // Si le filtre existe déjà, le met à jour
          updatedFilters[existingIndex] = newFilter;
        } else {
          // Sinon, ajoute le nouveau filtre
          updatedFilters.push(newFilter);
        }
      });

      return updatedFilters;
    });
  };
  const onSave = (pricelist) => {
    setLocked(true);
    if (pricelist.uuid) {
      updateItemsPricelist(
        modulesManager,
        pricelist,
        formatMessageWithValues("updatePricelist.mutationLabel", { name: pricelist.name })
      );
    } else {
      createItemsPricelist(
        modulesManager,
        pricelist,
        formatMessageWithValues("createPricelist.mutationLabel", { name: pricelist.name })
      );
    }
  };

  const onReset = () => {
    setLocked(false);
    setResetKey(Date.now());
  };

  const fetchDetails = () => {
    const formattedFilters = formatGraphQLFilters(filters);
    fetchItemsPricelistDetails(modulesManager, formattedFilters, pricelist?.id);
  };

  return (
    <StyledItemsPriceListDetailsPage className={clsx(pricelist.validityTo && "locked")}>
      <ErrorBoundary>
        <ProgressOrError progress={isFetching} error={error} />
        {!isFetching && (
          <PricelistForm
            key={resetKey}
            readOnly={!rights.includes(RIGHT_ITEMS_PRICELISTS_EDIT) || isLocked}
            pricelist={pricelist}
            onChange={setPricelist}
            onBack={() => historyPush(modulesManager, history, "medical_pricelist.itemsPricelists")}
            onSave={rights.includes(RIGHT_ITEMS_PRICELISTS_EDIT) ? onSave : undefined}
            onReset={onReset}
            details={details}
            fetchDetails={fetchDetails}
            onChangeFilters={onChangeFilters}
          />
        )}
      </ErrorBoundary>
    </StyledItemsPriceListDetailsPage>
  );
};

const mapStateToProps = (state, props) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  pricelist: props.match.params.price_list_id
    ? state.medical_pricelist.pricelists.items.items[props.match.params.price_list_id]
    : null,
  isFetching: state.medical_pricelist.pricelists.items.isFetching,
  error: state.medical_pricelist.pricelists.items.error,
  details: state.medical_pricelist.items,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createItemsPricelist,
      updateItemsPricelist,
      fetchItemsPricelistById,
      fetchItemsPricelistDetails,
    },
    dispatch
  );

const enhance = combine(
  withHistory,
  withModulesManager,
  connect(mapStateToProps, mapDispatchToProps)
);
export { StyledItemsPriceListDetailsPage };
export default enhance(ItemsPriceListDetailsPage);
