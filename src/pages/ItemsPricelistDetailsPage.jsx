import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import { bindActionCreators } from "redux";
import { combine, withHistory, withModulesManager, historyPush, ProgressOrError } from "@openimis/fe-core";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { ErrorBoundary, useTranslations } from "@openimis/fe-core";
import PricelistForm from "../components/PricelistForm";
import {
  createItemsPricelist,
  updateItemsPricelist,
  fetchItemsPricelistById,
  fetchItemsPricelistDetails,
} from "../actions";
import { RIGHT_ITEMS_PRICELISTS_EDIT } from "../constants";
const styles = (theme) => ({
  page: theme.page,
  locked: theme.page.locked,
});

const ItemsPriceListDetailsPage = (props) => {
  const {
    classes,
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

  const fetchDetails = (filters) => {
    fetchItemsPricelistDetails(modulesManager, filters, pricelist?.id);
  };

  return (
    <div className={clsx(classes.page, pricelist.validityTo && classes.locked)}>
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
          />
        )}
      </ErrorBoundary>
    </div>
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
  withTheme,
  withStyles(styles),
  withHistory,
  withModulesManager,
  connect(mapStateToProps, mapDispatchToProps)
);
export default enhance(ItemsPriceListDetailsPage);
