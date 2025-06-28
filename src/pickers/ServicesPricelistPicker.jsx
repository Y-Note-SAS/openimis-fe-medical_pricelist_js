import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from "react-intl";
import { fetchServicesPriceLists } from "../actions";
import PricelistPicker from "./PricelistPicker";

const ServicesPricelistPicker = (props) => {
  const { fetchServicesPriceLists, name, value, onChange, readOnly, region, district } = props;
  return (
    <PricelistPicker
      label="servicesPricelist"
      fetchPriceLists={fetchServicesPriceLists}
      parseKey="servicesPricelists"
      name={name}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      region={region}
      district={district}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchServicesPriceLists }, dispatch);
};

export default injectIntl(connect(null, mapDispatchToProps)(ServicesPricelistPicker));
