App = {
    web3Provider: null,
    contracts: {},
    contractInstance: null,

    init: function () {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new web3.providers.HttpProvider("https://rinkeby.infura.io/LEQtspgcuvyfF8zWn1rp");
            web3 = new Web3(App.web3Provider);
        }

        $.getJSON('Voting.json', function (data) {
            var artifact = data;
            App.contracts.Voting = TruffleContract(artifact);
            App.contracts.Voting.setProvider(App.web3Provider);

            App.contracts.Voting.deployed().then(function (instance) {
                contractInstance = instance;
            }).catch(function (err) {
                console.log(err.message);
            });
        });

        App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#addproduct', App.addProduct);
        $(document).on('click', '#getproduct', App.getProduct);
        $(document).on('click', '#vote', App.vote);
        $(document).on('click', '#getcounting', App.getCounting);
        $(document).on('click', '#getresults', App.getResults);
    },

    sayHello: function () {
        console.log("Hello my dear friend!");
    },

    addProduct: function () {
        var sku = $('#sku').val();
        var name = $('#name').val();
        var url = $('#url').val();
        return contractInstance.addProduct(sku, name, url);
    },

    getProduct: function getProduct() {
        contractInstance.getProduct()
            .then(function (result) {
                console.log("Result getProduct: 1) sku: " + result[0] + " | 2) name: " + result[1] + " | 3) url:  " + result[2])
            });
    },

    vote: function vote() {

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            var myAddress = accounts[0];
            console.log("My Address: " + myAddress);

            var rating = $('#rating').val();
            contractInstance.voteProduct(rating, myAddress)
                .then(function (error) {
                    console.log(error)
                });
        });

    },

    getCounting: function getCounting() {
        contractInstance.getCounting()
            .then(function (result) {
                console.log("Total of votes: " + result)
            });
    },

    getResults: function getResults() {
        contractInstance.getResults()
            .then(function (result) {
                console.log("Total of votes: " + result[0] + " | Sum of rating: " + result[1])
            });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});