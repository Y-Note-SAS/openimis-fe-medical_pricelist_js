import React from "react";
import { connect } from "react-redux";

import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import _debounce from "lodash/debounce";

import {
  FormPanel,
  withHistory,
  withModulesManager,
  PublishedComponent,
  ValidatedTextInput,
  TextInput,
  useDebounceCb,
  GRID_RESPONSIVE_STANDARD,
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

const StyledPricelistGeneralPanel = styled("div")(({ theme }) => ({
  "& .item": theme.paper?.item ?? {},
}));

class PricelistGeneralPanel extends FormPanel {
  constructor(props) {
    super(props);
    const debounceTime = props.modulesManager.getConf("fe-medical_pricelist", "debounceTime", 500);
    this.triggerDebounceName = _debounce(this.onNameChange, debounceTime);
    this.triggerDebounceCode = _debounce(this.onCodeChange, debounceTime);
  }
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
  onCodeChange = (value) => {
    this.props.onChangeFilters([{ id: "code", value, filter: `code_Icontains: "${value}"` }]);
  };
  onNameChange = (value) => {
    this.props.onChangeFilters([{ id: "name", value, filter: `name_Icontains: "${value}"` }]);
  };

  render() {
    const {
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
      <StyledPricelistGeneralPanel>
        <Grid container>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
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
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              pubRef="location.RegionPicker"
              value={region}
              readOnly={readOnly}
              withNull={false}
              onChange={this.onRegionChange}
            />
          </Grid>
          <Grid className="item" xs={GRID_RESPONSIVE_STANDARD}>
            <TextInput
              module="medical"
              label={`medical_pricelist.table.code`}
              value={edited?.code ?? ""}
              onChange={this.triggerDebounceCode}
            />
          </Grid>
          <Grid className="item" xs={GRID_RESPONSIVE_STANDARD}>
            <TextInput
              module="insuree"
              label={
                !!this.props.activeType && this.props.activeType === "items"
                  ? `medical_pricelist.table.medicalItemName`
                  : `medical_pricelist.table.medicalServiceName`
              }
              value={edited?.serviceName ?? ""}
              onChange={this.triggerDebounceName}
              readOnly={readOnly}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              region={region}
              value={district}
              pubRef="location.DistrictPicker"
              withNull={false}
              readOnly={readOnly}
              onChange={this.onDistrictChange}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
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
      </StyledPricelistGeneralPanel>
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

export { StyledPricelistGeneralPanel };
export default withHistory(withModulesManager(connect(mapStateToProps)(PricelistGeneralPanel)));
