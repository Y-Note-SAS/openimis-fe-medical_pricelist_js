import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  withHistory,
  historyPush,
  combine,
  withModulesManager,
  useTranslations,
  withTooltip,
  clearCurrentPaginationPage,
} from "@openimis/fe-core";
import PricelistsSearcher from "../components/PricelistsSearcher";
import { fetchServicesPricelistsSummaries, deleteServicesPricelist } from "../actions";
import { RIGHT_SERVICES_PRICELISTS_DELETE, RIGHT_SERVICES_PRICELISTS_ADD, MODULE_NAME } from "../constants";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

const ServicesPricelistsPage = (props) => {
  const { classes, modulesManager, history } = props;
  const { formatMessage, formatMessageWithValues } = useTranslations("medical_pricelist", modulesManager);
  const rights = useSelector((state) => state.core.user?.i_user?.rights ?? []);
  const module = useSelector((state) => state.core?.savedPagination?.module);
  const data = useSelector((state) => state.medical_pricelist.summaries.services);
  const dispatch = useDispatch();

  const onDoubleClick = (row, newTab = false) => {
    historyPush(modulesManager, history, "medical_pricelist.servicesPricelistDetails", [row.id], newTab);
  };

  const onAdd = () => {
    historyPush(modulesManager, history, "medical_pricelist.newServicesPricelist");
  };

  const onFiltersChange = (filters) => {
    dispatch(fetchServicesPricelistsSummaries(modulesManager, filters));
  };

  const onDelete = (pricelist) => {
    dispatch(
      deleteServicesPricelist(
        modulesManager,
        pricelist.uuid,
        formatMessageWithValues("deletePricelist.mutationLabel", { name: pricelist.name })
      )
    );
  };

  useEffect(() => {
    if (module !== MODULE_NAME) dispatch(clearCurrentPaginationPage());

    return () => {
      const { location, history } = props;
      const {
        location: { pathname },
      } = history;
      const urlPath = location.pathname;

      if (!pathname.includes(urlPath)) dispatch(clearCurrentPaginationPage());
    };
  }, [module]);

  return (
    <div className={classes.page}>
      <PricelistsSearcher
        onFiltersChange={onFiltersChange}
        onDelete={onDelete}
        items={data.items}
        pageInfo={data.pageInfo}
        isFetching={data.isFetching}
        isFetched={data.isFetched}
        canDelete={(pricelist) => rights.includes(RIGHT_SERVICES_PRICELISTS_DELETE) && !pricelist.validTo}
        onDoubleClick={onDoubleClick}
        cacheFiltersKey="medicalServicesPriceListsPageFiltersCache"
      />
      {rights.includes(RIGHT_SERVICES_PRICELISTS_ADD) &&
        withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={onAdd}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage("addNewPriceListTooltip")
        )}
    </div>
  );
};

const enhance = combine(withModulesManager, withHistory, withTheme, withStyles(styles));

export default enhance(ServicesPricelistsPage);
