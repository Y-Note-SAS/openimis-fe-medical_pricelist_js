import React, { useCallback, useState } from "react";

import { Tooltip, IconButton } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";

import { combine, useTranslations, ConfirmDialog, Searcher, withModulesManager } from "@openimis/fe-core";
import PricelistsFilters from "./PricelistsFilters";

const isRowDisabled = (_, row) => Boolean(row.validityTo);
const isRowLocked = () => false;

const formatLocation = (location) => {
  return location ? `${location.code} - ${location.name}` : "";
};

const styles = (theme) => ({
  horizontalButtonContainer: theme.buttonContainer.horizontal,
});

const PricelistsSearcher = (props) => {
  const {
    pageInfo,
    items,
    classes,
    isFetching,
    isFetched,
    cacheFiltersKey,
    canDelete,
    onDelete,
    modulesManager,
    onDoubleClick,
    onFiltersChange,
  } = props;
  const [confirmPricelistToDelete, setPricelistToDelete] = useState(null);
  const [resetKey, setResetKey] = useState();
  const { formatMessage, formatMessageWithValues, formatDateFromISO } = useTranslations(
    "medical_pricelist",
    modulesManager
  );

  const onDeleteConfirm = (isConfirmed) => {
    if (isConfirmed) {
      onDelete(confirmPricelistToDelete);
      setResetKey(Date.now());
    }
    setPricelistToDelete(null);
  };

  const headers = (filters) => [
    "medical_pricelist.name",
    "medical_pricelist.pricelist_date",
    "medical_pricelist.region",
    "medical_pricelist.district",
    filters?.showHistory?.value ? "medical_pricelist.valid_from" : null,
    filters?.showHistory?.value ? "medical_pricelist.valid_to" : null,
    "",
  ];

  const getAligns = () => headers().map((_, i) => i === headers().length - 1 && "right");

  const itemFormatters = useCallback((filters) => {
    return [
      (pricelist) => pricelist.name,
      (pricelist) => formatDateFromISO(pricelist.pricelistDate),
      (pricelist) => formatLocation(pricelist.location?.parent || pricelist.location),
      (pricelist) => formatLocation(pricelist.location?.parent ? pricelist.location : null),
      (pricelist) => (filters?.showHistory?.value ? formatDateFromISO(pricelist.validityFrom) : null),
      (pricelist) => (filters?.showHistory?.value ? formatDateFromISO(pricelist.validityTo) : null),
      (pricelist) => (
        <div className={classes.horizontalButtonContainer}>
          <Tooltip title={formatMessage("openNewTab")}>
            <IconButton onClick={() => onDoubleClick(pricelist, true)}>
              <TabIcon />
            </IconButton>
          </Tooltip>
          {canDelete(pricelist) && (
            <Tooltip title={formatMessage("deletePricelistTooltip")}>
              <IconButton onClick={() => setPricelistToDelete(pricelist)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    ];
  }, []);
  
  const filtersToQueryParams = useCallback((state) => {
    const params = Object.keys(state.filters)
      .filter((contrib) => !!state.filters[contrib].filter)
      .map((contrib) => state.filters[contrib].filter);
    if (!state.beforeCursor && !state.afterCursor) {
      params.push(`first: ${state.pageSize}`);
    }
    if (state.afterCursor) {
      params.push(`after: "${state.afterCursor}"`);
      params.push(`first: ${state.pageSize}`);
    }
    if (state.beforeCursor) {
      params.push(`before: "${state.beforeCursor}"`);
      params.push(`last: ${state.pageSize}`);
    }
    return params;
  }, []);

  return (
    <>
      {confirmPricelistToDelete && (
        <ConfirmDialog
          confirm={{
            title: formatMessage("deletePricelistDialog.title"),
            message: formatMessageWithValues("deletePricelistDialog.message", { name: confirmPricelistToDelete.name }),
          }}
          onConfirm={onDeleteConfirm}
        />
      )}
      <Searcher
        key={resetKey}
        module="medical_pricelist"
        FilterPane={PricelistsFilters}
        cacheFiltersKey={cacheFiltersKey}
        items={items}
        itemsPageInfo={pageInfo}
        fetchingItems={isFetching}
        fetchedItems={isFetched}
        errorItems={null}
        tableTitle={formatMessageWithValues("pricelistsSearcher.table.title", {
          count: pageInfo.totalCount ?? 0,
        })}
        fetch={onFiltersChange}
        rowDisabled={isRowDisabled}
        rowLocked={isRowLocked}
        headers={headers}
        aligns={getAligns}
        itemFormatters={itemFormatters}
        rowIdentifier={(r) => r.uuid}
        filtersToQueryParams={filtersToQueryParams}
        onDoubleClick={onDoubleClick}
      />
    </>
  );
};

const enhance = combine(withTheme, withModulesManager, withStyles(styles))

export default enhance(PricelistsSearcher);
