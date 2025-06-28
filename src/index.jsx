import messages_en from "./translations/en.json";
import reducer from "./reducer";
import PriceListLoader from "./components/PriceListLoader";
import ServicesPricelistPicker from "./pickers/ServicesPricelistPicker";
import ItemsPricelistPicker from "./pickers/ItemsPricelistPicker";
import ServicesPricelistsPage from "./pages/ServicesPricelistsPage";
import ItemsPricelistsPage from "./pages/ItemsPricelistsPage";
import ServicesPricelistDetailsPage from "./pages/ServicesPricelistDetailsPage";
import ItemsPricelistDetailsPage from "./pages/ItemsPricelistDetailsPage";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "medical_pricelist", reducer }],
  "refs": [
    { key: "medical_pricelist.ServicesPriceListPicker", ref: ServicesPricelistPicker },
    { key: "medical_pricelist.ServicesPriceListPicker.projection", ref: ["id"] },
    { key: "medical_pricelist.ItemsPriceListPicker", ref: ItemsPricelistPicker },
    { key: "medical_pricelist.ItemsPriceListPicker.projection", ref: ["id"] },

    // Services Routes references
    { key: "medical_pricelist.servicesPricelists", ref: "medical/pricelists/services" },
    { key: "medical_pricelist.servicesPricelistDetails", ref: "medical/pricelists/services" },
    { key: "medical_pricelist.newServicesPricelist", ref: "medical/pricelists/services/new" },

    // Items Routes references
    { key: "medical_pricelist.itemsPricelists", ref: "medical/pricelists/items" },
    { key: "medical_pricelist.itemsPricelistDetails", ref: "medical/pricelists/items" },
    { key: "medical_pricelist.newItemsPricelist", ref: "medical/pricelists/items/new" },
  ],
  "core.Boot": [PriceListLoader],
  "core.Router": [
    { path: "medical/pricelists/services", component: ServicesPricelistsPage },
    { path: "medical/pricelists/services/new", component: ServicesPricelistDetailsPage },
    { path: "medical/pricelists/services/:price_list_id", component: ServicesPricelistDetailsPage },
    { path: "medical/pricelists/items", component: ItemsPricelistsPage },
    { path: "medical/pricelists/items/new", component: ItemsPricelistDetailsPage },
    { path: "medical/pricelists/items/:price_list_id", component: ItemsPricelistDetailsPage },
  ],
};

export const MedicalPriceListModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
