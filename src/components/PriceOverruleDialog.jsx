import React, { useState } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { combine, FormattedMessage, NumberInput } from "@openimis/fe-core";

const styles = (theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
});

const PriceOverruleDialog = (props) => {
  const { classes, open, onCancel, defaultPrice, onConfirm } = props;
  const [value, setValue] = useState(defaultPrice);
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>
        <FormattedMessage module="medical_pricelist" id="priceOverruleDialog.title" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage module="medical_pricelist" id="priceOverruleDialog.message" />
        </DialogContentText>
        <NumberInput
          autoFocus
          margin="dense"
          id="price"
          module="medical_pricelist"
          label="medical_pricelist.priceOverruleDialog.input"
          min={0}
          value={value}
          onChange={setValue}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => onConfirm(value)} className={classes.primaryButton} autoFocus>
          <FormattedMessage module="medical_pricelist" id="priceOverruleDialog.yes.button" />
        </Button>
        <Button onClick={(e) => onConfirm(null)} className={classes.secondaryButton} autoFocus>
          <FormattedMessage module="medical_pricelist" id="priceOverruleDialog.clear.button" />
        </Button>
        <Button onClick={onCancel} className={classes.secondaryButton}>
          <FormattedMessage module="core" id="cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const enhance = combine(withTheme, withStyles(styles));

export default enhance(PriceOverruleDialog);
