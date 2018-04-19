function setup() {
    var abiArray = [{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"dividends","type":"uint256"}],"name":"Reinvest","type":"event"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"dividends","type":"uint256"}],"name":"Claim","type":"event"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"preauthorize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"startGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"dividendsForUser","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investment","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"stake","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalStake","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
    var contractAddress = "";
    var contract = web3.eth.contract(abiArray).at(contractAddress);

    if (web3.eth.defaultAccount !== undefined) {
        $("#deposit-input").prop("disabled", false);
        $("#withdraw-input").prop("disabled", false);
        $("#deposit-button").prop("disabled", false);
        $("#withdraw-button").prop("disabled", false);
        $("#fill-balance-button").prop("disabled", false);
        $("#claim-button").prop("disabled", false);
        $("#reinvest-button").prop("disabled", false);
    }

    $("#deposit-button").click(function() {
        var value = web3.toWei($("#deposit-input").val(), "ether");
        contract.deposit({value: value}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#withdraw-button").click(function() {
        var value = web3.toWei($("#withdraw-input").val(), "ether");
        contract.withdraw(value, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#fill-balance-button").click(function() {
        contract.investment(web3.eth.defaultAccount, function(error, result) {
            if (!error)
                $("#withdraw-input").val(web3.fromWei(result, "ether"));
        });
    });

    $("#claim-button").click(function() {
        contract.claim(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#reinvest-button").click(function() {
        contract.reinvest(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    function refresh() {
        function formatEth(wei) {
            return web3.fromWei(wei, "ether").toFormat(4) + " ETH";
        }

        web3.eth.getBalance(contractAddress, function(error, result) {
            if (!error)
                $("#contract-balance").text(formatEth(result));
        });

        if (web3.eth.defaultAccount !== undefined) {
            contract.investment(web3.eth.defaultAccount, function(error, result) {
                if (!error)
                    $("#investment").text(formatEth(result));
            });

            contract.dividendsForUser(web3.eth.defaultAccount, function(error, result) {
                if (!error) {
                    $("#dividends").text(formatEth(result));
                    $("#dividends-input").attr("placeholder", formatEth(result) + " Dividends");
                }
            });

            contract.stake(web3.eth.defaultAccount, function(error, stake) {
                if (!error)
                    contract.totalStake(function(error, totalStake) {
                        if (!error)
                            $("#stake").text(stake.mul(100).dividedBy(totalStake).toFormat(4) + "%");
                    });
            });
        }
    }

    refresh();
    setInterval(refresh, 1000);
}

window.addEventListener("load", function() {
    if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "1") {
                    setup();
                } else {
                    $("#error").text("You must be on the Main Ethereum Network to use this website.");
                    $("#error").toggle(true);
                }
            }
        });
    } else {
        $("#error").html('Please install <a class="text-success" href="https://metamask.io/">MetaMask</a> to use this website.');
        $("#error").toggle(true);
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/EDcemR2TA0oKZOWw2VZv"));
        setup();
    }
});
