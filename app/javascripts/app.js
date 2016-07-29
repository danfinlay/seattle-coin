var accounts;
var account;
var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var meta = MetaCoin.deployed();

  meta.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

function sendCoin() {
  var meta = MetaCoin.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;

  setStatus("Initiating transaction... (please wait)");

  meta.sendCoin(receiver, amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

window.onload = init
function init () {

  var result = web3.eth.getBlock(9)
  console.dir(result)

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = web3.eth.defaultAccount || accounts[0];

    refreshBalance();
    displayAccount();

    watchAccountForChanges();
  });
}

function displayAccount() {
  var accountEl = document.querySelector('#accountLabel')
  if (account) {
    accountEl.innerText = account
  } else {
    accountEl.innerText = '(none)'
  }
}

var watchInterval
function watchAccountForChanges() {
  if (watchInterval) {
    clearInterval(watchInterval)
  }
  watchInterval = setInterval(function() {
    if (web3.eth.defaultAccount !== account) {
      init()
    }
  }, 100)
}
