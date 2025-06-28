import React, { useState, useEffect } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Table, withModulesManager, combine, useTranslations, ErrorBoundary } from "@openimis/fe-core";
import { Paper, Grid, Typography, Checkbox, Button} from "@material-ui/core";
import PriceOverruleDialog from "./PriceOverruleDialog";
import SelectAllButton from "./PricelistSelectAllButton" 

const styles = (theme) => ({
  paper: theme.paper.paper,
  item: theme.paper.item,
  tableTitle: theme.table.title,
  checkbox: {
    padding: theme.spacing(0),
  },
  editDetailBtn: {
    padding: 0,
  },
});

const HEADERS = [
  "",
  "medical_pricelist.table.code",
  "medical_pricelist.table.name",
  "medical_pricelist.table.type",
  "medical_pricelist.table.price",
  "medical_pricelist.table.overrule",
  "",
];

const isItemActive = (edited, item) => {
  return edited.addedDetails?.includes(item.uuid) || (item.isActive && !edited.removedDetails?.includes(item.uuid));
};

const PricelistDetailsPanel = (props) => {
  const {
    classes,
    modulesManager,
    pageSize = 20,
    edited,
    edited_id,
    readOnly,
    details,
    fetchDetails,
    onEditedChanged,
  } = props;
  const { formatMessage } = useTranslations("medical_pricelist", modulesManager);
  const [pagination, setPagination] = useState({ page: 0, afterCursor: null, beforeCursor: null });
  const [editedDetail, setEditedDetail] = useState(null);
  
  const ButtonHeader = (_) => {
    return SelectAllButton(details, props, edited, onEditedChanged, edited)
  }

  HEADERS[0] = ButtonHeader

  useEffect(() => {
    const filters = [];
    if (pagination.afterCursor) {
      filters.push(`first: ${pageSize}`, `after: "${pagination.afterCursor}"`);
    } else if (pagination.beforeCursor) {
      filters.push(`last: ${pageSize}`, `before: "${pagination.beforeCursor}"`);
    } else {
      filters.push(`first: ${pageSize}`);
    }

    fetchDetails(filters);
  }, [pagination.page, edited_id]);

  const onDetailChange = (event, item) => {
    if (event.target.checked) {
      onEditedChanged({
        ...edited,
        // It's useless to add the item to the list of added items if it is already marked as active
        addedDetails: !item.isActive ? (edited.addedDetails ?? []).concat(item.uuid) : edited.addedDetails,
        removedDetails: edited.removedDetails && edited.removedDetails.filter((x) => x !== item.uuid),
      });
    } else {
      onEditedChanged({
        ...edited,
        addedDetails: edited.addedDetails && edited.addedDetails.filter((x) => x !== item.uuid),
        removedDetails: item.isActive ? (edited.removedDetails ?? []).concat([item.uuid]) : edited.removedDetails,
      });
    }
  };

  const onPriceChange = (price) => {
    editedDetail.priceOverrule = price;
    onEditedChanged({
      ...edited,
      priceOverrules: {
        ...edited.priceOverrules,
        [editedDetail.uuid]: price,
      },
    });
    setEditedDetail(null);
  };

  return (
    <>
      {editedDetail && (
        <ErrorBoundary>
          <PriceOverruleDialog
            open
            defaultPrice={
              (edited.priceOverrules && edited.priceOverrules[editedDetail.uuid]) ||
              editedDetail.priceOverrule ||
              editedDetail.price
            }
            onConfirm={onPriceChange}
            onCancel={() => setEditedDetail(null)}
          />
        </ErrorBoundary>
      )}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container className={classes.tableTitle} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">{formatMessage("pricelistForm.table.title")}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} className={classes.item}>
              <Table
                error={details.error}
                fetching={details.isFetching}
                headers={HEADERS}
                itemFormatters={[
                  (s) => (
                    <Checkbox
                      disabled={readOnly}
                      className={classes.checkbox}
                      color="primary"
                      onChange={(event) => onDetailChange(event, s)}
                      checked={isItemActive(edited, s)}
                    />
                  ),
                  (s) => s.code,
                  (s) => s.name,
                  (s) => formatMessage(`medical_pricelist.table.type.${s.type.toLowerCase()}`),
                  (s) => s.price,
                  (s) => s.priceOverrule,
                  (s) =>
                    isItemActive(edited, s) &&
                    !readOnly && (
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        className={classes.editDetailBtn}
                        onClick={() => setEditedDetail(s)}
                      >
                        {formatMessage("medical_pricelist.table.editOverruleButton")}
                      </Button>
                    ),
                ]}
                aligns={HEADERS.map((_, i) => (i === HEADERS.length - 1 ? "right" : null))}
                items={details.items}
                withPagination
                page={pagination.page}
                onChangePage={(_, page) =>
                  setPagination({
                    afterCursor: page > pagination.page ? details.pageInfo.endCursor : null, // We'll load the next page
                    beforeCursor: page < pagination.page ? details.pageInfo.startCursor : null, // We'll load the previous page
                    page,
                  })
                }
                count={details.pageInfo.totalCount}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[pageSize]}
              ></Table>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

const enhance = combine(withModulesManager, withTheme, withStyles(styles));

export default enhance(PricelistDetailsPanel);
