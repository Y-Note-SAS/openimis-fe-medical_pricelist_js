import React from "react";
import { useTranslations } from "@openimis/fe-core";
import { Button, Box } from "@material-ui/core";

export function SelectAllButton (details, props, edited, onEditedChanged) {
    const {
      modulesManager,
    } = props;
    const { formatMessage } = useTranslations("medical_pricelist", modulesManager);

    const page_details_uuids = details.items ? details.items.map(d => d.uuid) : []
    const current_added_details = edited.addedDetails? edited.addedDetails : []
    const areNotAllSelected = !current_added_details.includes(...page_details_uuids)
    const current_removed_details = edited.removedDetails? edited.removedDetails : []


    if (areNotAllSelected) {
        page_details_uuids.push(...current_removed_details)    
    } else {
        page_details_uuids.push(...current_added_details)    
    }

    const new_details_uuids = [...new Set(page_details_uuids)]
    //details.items.length > (!!edited.addedDetails? edited.addedDetails.length : 0)
  
    const selectAllEdited = () => {
      try {
        const addedDetails = areNotAllSelected ? new_details_uuids : current_removed_details;
        const removedDetails = areNotAllSelected ? current_removed_details : new_details_uuids;
        onEditedChanged({
          ...edited,
          addedDetails,
          removedDetails
        })
      } catch (error) {
        console.error(error);
      }
    }
    
    return (
          <Box flexGrow={1}>
          <Box display="flex" justifyContent="flex-end">
          <Button onClick={() => selectAllEdited()} color="primary" disabled={props.readOnly} fullWidth>
        {areNotAllSelected ? formatMessage("medical_pricelist.table.selectAll") : formatMessage("medical_pricelist.table.unselectAll")}
      </Button>
          </Box>
        </Box>
    );
  }

export default SelectAllButton;
