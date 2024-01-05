import React, { createContext, useReducer } from "react";
import ReactDOMServer from "react-dom/server";

const NotificationsContext = createContext({});

const initialState = {
  notifications: JSON.parse(localStorage.getItem("notifications")) || [],
  offset: JSON.parse(localStorage.getItem("offset")) || 0,
};

function saveNotifications(notifications) {
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

// localStorage.clear();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      let notification = action.payload.notification;

      // adiciona o ID da notificação com base no offset
      notification.id = state.offset;

      // serializa o conteúdo da notificação
      notification.content = ReactDOMServer.renderToString(
        notification.content
      );

      // adiciona a notificação no array de notificações
      const newNotifications = [...state.notifications, notification];

      // salva o array de notificações no localStorage
      saveNotifications(newNotifications);

      // incrementa o offset
      const newOffset = state.offset + 1;
      localStorage.setItem("offset", JSON.stringify(newOffset));

      // retorna o novo array de notificações
      return {
        ...state,
        notifications: newNotifications,
      };

    case "REMOVE_NOTIFICATION":
      // remove a notificação do array de notificações
      const newNotifications2 = state.notifications.filter(
        (notification) => notification.id !== action.payload.notification.id
      );

      // salva o array de notificações no localStorage
      saveNotifications(newNotifications2);

      // retorna o novo array de notificações
      return {
        ...state,
        notifications: newNotifications2,
      };
    default:
      return state;
  }
};

export const NotificationsProvider = ({ children }) => {
  const [stateNotif, dispatchNotif] = useReducer(reducer, initialState);

  return (
    <NotificationsContext.Provider value={{ stateNotif, dispatchNotif }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
