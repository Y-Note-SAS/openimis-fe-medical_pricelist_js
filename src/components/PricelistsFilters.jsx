import React from "react";
import {
  combine,
  ControlledField,
  PublishedComponent,
  TextInput,
  useTranslations,
  withModulesManager,
  useDebounceCb,
} from "@openimis/fe-core";
import { FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
});

const PricelistsFilter = (props) => {
  const { classes, filters, onChangeFilters, modulesManager } = props;
  const { formatMessage } = useTranslations("medical_pricelist", modulesManager);

  const onRegionChange = (value) => {
    onChangeFilters([
      { id: "region", value, filter: value ? `location_Uuid: "${value.uuid}"` : null },
      { id: "district", value: null, filter: null },
    ]);
  };
  const onDistrictChange = (value) => {
    onChangeFilters([{ id: "district", value, filter: value ? `location_Uuid: "${value.uuid}"` : null }]);
  };
  const onNameChange = (value) => {
    onChangeFilters([{ id: "name", value, filter: `name_Icontains: "${value}"` }]);
  };

  const triggerDebounceName = useDebounceCb(onNameChange, modulesManager.getConf("fe-admin", "debounceTime", 500));

  return (
    <section className={classes.form}>
      <Grid container>
        <ControlledField
          module="medical_pricelist"
          id="medicalPricelistsFilter.name"
          field={
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="medical_pricelist"
                name="name"
                label="medical_pricelist.name"
                value={filters?.name?.value}
                onChange={triggerDebounceName}
              />
            </Grid>
          }
        />
        <ControlledField
          module="medical_pricelist"
          id="medicalPricelistsFilter.region"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={filters?.region?.value}
                withNull={true}
                onChange={onRegionChange}
              />
            </Grid>
          }
        />
        <ControlledField
          module="medical_pricelist"
          id="medicalPricelistsFilter.district"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={filters?.district?.value}
                region={filters?.region?.value}
                withNull={true}
                key={filters?.region?.value}
                onChange={onDistrictChange}
              />
            </Grid>
          }
        />
        <ControlledField
          module="medical_pricelist"
          id="medicalPricelistsFilter.date"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={filters?.date?.value}
                module="medical_pricelist"
                label="medical_pricelist.pricelist_date"
                onChange={(d) =>
                  onChangeFilters([
                    {
                      id: "date",
                      value: d,
                      filter: d ? `pricelistDate: "${d}"` : null,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="medical_pricelist"
          id="medicalPricelistsFilter.showHistory"
          field={
            <Grid item xs={6} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={filters?.showHistory?.value}
                    onChange={() =>
                      onChangeFilters([
                        {
                          id: "showHistory",
                          value: !filters?.showHistory?.value,
                          filter: `showHistory: ${!filters?.showHistory?.value}`,
                        },
                      ])
                    }
                  />
                }
                label={formatMessage("medical_pricelist.showHistory")}
              />
            </Grid>
          }
        />
      </Grid>
    </section>
  );
};

const enhance = combine(withTheme, withStyles(styles), withModulesManager);

export default enhance(PricelistsFilter);
