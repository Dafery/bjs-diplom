'use strict';

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

// Выход из личного кабинета

logoutButton.action = function() {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    }
  });
}

// Получение информации о пользователе

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
})

// Получение текущих курсов валют

function getStocks() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

getStocks();
setInterval(() => getStocks(), 60000);

// Операции с деньгами

moneyManager.addMoneyCallback = function(data) {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Счёт был успешно пополнен на ${data.amount + data.currency}`);
    } else {
      this.setMessage(response.success, response.error);
    }
  });
}

moneyManager.conversionMoneyCallback = function(data) {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Конвертация прошла успешно`);
    } else {
      this.setMessage(response.success, response.error);
    }
  });
}

moneyManager.sendMoneyCallback = function(data) {
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Перевод ${data.amount + data.currency} прошёл успешно`);
    } else {
      this.setMessage(response.success, response.error);
    }
  });
}

// Работа с избранным

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = function(data) {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      this.setMessage(response.success, `Пользователь ${data.name} успешно добавлен`);
    } else {
      this.setMessage(response.success, response.error);
    }
  })
}

favoritesWidget.removeUserCallback = function(data) {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      this.setMessage(response.success, `Пользователь успешно удалён`);
    } else {
      this.setMessage(response.success, response.error);
    }
  })
}