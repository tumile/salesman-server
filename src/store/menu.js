const SHOW_CATALOG = "SHOW_CATALOG";

export const showTravelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_CATALOG,
      payload: { travelCatalogOpen: isOpen, hotelCatalogOpen: false },
    });
  };
};

export const showHotelCatalog = (isOpen) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_CATALOG,
      payload: { travelCatalogOpen: false, hotelCatalogOpen: isOpen },
    });
  };
};

const initialState = {
  travelCatalogOpen: false,
  hotelCatalogOpen: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_CATALOG:
      return {
        ...state,
        travelCatalogOpen: payload.travelCatalogOpen,
        hotelCatalogOpen: payload.hotelCatalogOpen,
      };
    default:
      return state;
  }
};
