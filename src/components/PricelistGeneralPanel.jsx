import React from "react";
import { connect } from "react-redux";

import { withStyles, withTheme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import { 
  FormPanel, withHistory, withModulesManager, 
  PublishedComponent, ValidatedTextInput 
} from "@openimis/fe-core";
import {
  medicalServicesValidationCheck,
  medicalServicesValidationClear,
  medicalServicesSetValid,
  medicalItemsValidationCheck,
  medicalItemsValidationClear,
  medicalItemsSetValid,
} from "../actions";
import { SERVICES_PRICELIST_TYPE } from "../constants";

const styles = (theme) => ({
  item: theme.paper.item,
});

class PricelistGeneralPanel extends FormPanel {
  onRegionChange = (value) => {
    this.updateAttribute("location", value);
  };

  onDistrictChange = (value) => {
    this.updateAttribute("location", value ?? this.props.edited.location?.parent);
  };

  shouldValidate = (inputValue) => {
    const { savedServiceName, savedItemName } = this.props;
    const shouldValidate = inputValue !== (savedServiceName || savedItemName);
    return shouldValidate;
  };

  render() {
    const {
      classes,
      readOnly,
      edited,
      isMedicalServiceValid,
      isMedicalServiceValidating,
      medicalServiceValidationError,
      isMedicalItemValid,
      isMedicalItemValidating,
      medicalItemValidationError,
      activeType,
    } = this.props;
    const region = edited.location?.parent ?? edited.location;
    const district = edited.location?.parent ? edited.location : null;
    const servicesOrItems = activeType === SERVICES_PRICELIST_TYPE;
    return (
      <>
        <Grid container>
          <Grid item xs={4} className={classes.item}>
            <ValidatedTextInput
              action={servicesOrItems ? medicalServicesValidationCheck : medicalItemsValidationCheck}
              clearAction={servicesOrItems ? medicalServicesValidationClear : medicalItemsValidationClear}
              setValidAction={servicesOrItems ? medicalServicesSetValid : medicalItemsSetValid}
              itemQueryIdentifier={servicesOrItems ? "servicesPricelistName" : "itemsPricelistName"}
              isValid={servicesOrItems ? isMedicalServiceValid : isMedicalItemValid}
              isValidating={servicesOrItems ? isMedicalServiceValidating : isMedicalItemValidating}
              validationError={servicesOrItems ? medicalServiceValidationError : medicalItemValidationError}
              shouldValidate={this.shouldValidate}
              module="medical_pricelist"
              label="medical_pricelist.name"
              codeTakenLabel="medical_pricelist.nameTaken"
              onChange={(name) => this.updateAttribute("name", name)}
              required={true}
              readOnly={readOnly}
              value={edited?.name ?? ""}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="location.RegionPicker"
              value={region}
              readOnly={readOnly}
              withNull={false}
              onChange={this.onRegionChange}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              region={region}
              value={district}
              pubRef="location.DistrictPicker"
              withNull={false}
              readOnly={readOnly}
              onChange={this.onDistrictChange}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              value={edited?.pricelistDate}
              required
              readOnly={readOnly}
              module="medical_pricelist"
              label="medical_pricelist.pricelist_date"
              onChange={(v) => this.updateAttribute("pricelistDate", v)}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isMedicalServiceValid: state.medical_pricelist.validationFields?.medicalServices?.isValid,
  isMedicalServiceValidating: state.medical_pricelist.validationFields?.medicalServices?.isValidating,
  medicalServiceValidationError: state.medical_pricelist.validationFields?.medicalServices?.validationError,
  savedServiceName: state.medical_pricelist?.pricelists?.services.item?.name,
  isMedicalItemValid: state.medical_pricelist.validationFields?.medicalItems?.isValid,
  isMedicalItemValidating: state.medical_pricelist.validationFields?.medicalItems?.isValidating,
  medicalItemValidationError: state.medical_pricelist.validationFields?.medicalItems?.validationError,
  savedItemName: state.medical_pricelist?.pricelists?.items.item?.name,
  activeType: state.medical_pricelist?.services?.type || state.medical_pricelist?.items?.type,
});

export default withHistory(
  withModulesManager(connect(mapStateToProps)(withTheme(withStyles(styles)(PricelistGeneralPanel))))
);
