import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ReplayIcon from "@material-ui/icons/Replay";

import { withHistory, withModulesManager, Form } from "@openimis/fe-core";
import { clearMedicalPricelists } from "../actions";
import PricelistGeneralPanel from "./PricelistGeneralPanel";
import PricelistDetailsPanel from "./PricelistDetailsPanel";

const PricelistForm = (props) => {
  const {
    readOnly,
    onBack,
    onSave,
    onReset,
    pricelist,
    onChange,
    fetchDetails,
    details,
    isValid,
    clearMedicalPricelists,
  } = props;

  const canSave = () => pricelist.name && pricelist.pricelistDate && !pricelist.validityTo && isValid === true;

  useEffect(() => {
    return () => {
      clearMedicalPricelists();
    };
  }, []);

  return (
    <>
      <Form
        module="medical_pricelist"
        title={pricelist.uuid ? "medical_pricelist.pricelistForm.title" : "medical_pricelist.pricelistForm.emptyTitle"}
        titleParams={{ label: pricelist.name ?? "" }}
        readOnly={readOnly || pricelist.validityTo}
        edited={pricelist}
        edited_id={pricelist.uuid}
        HeadPanel={PricelistGeneralPanel}
        Panels={[PricelistDetailsPanel]}
        save={onSave}
        back={onBack}
        canSave={canSave}
        onEditedChanged={onChange}
        details={details}
        fetchDetails={fetchDetails}
        openDirty={onSave}
        actions={[
          {
            doIt: onReset,
            icon: <ReplayIcon />,
            onlyIfDirty: !readOnly,
          },
        ]}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  isValid:
    !!state.medical_pricelist.validationFields?.medicalServices?.isValid ||
    !!state.medical_pricelist.validationFields?.medicalItems?.isValid,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ clearMedicalPricelists }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(PricelistForm)));
