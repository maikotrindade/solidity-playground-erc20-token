const Voting = artifacts.require("./Voting.sol")

contract("Voting", (accounts) => {
  let votingInstance, account0, account1, account2

  beforeEach(async () => {
    votingInstance = await Voting.new()
    account0 = accounts[0]
    account1 = accounts[1]
    account2 = accounts[2]
  })

  it("should add a product", async () => {
    let expectedSku = 20;

    await votingInstance.addProduct(expectedSku, "Phone", "http://bit.ly/ha7fei")

    let product = await votingInstance.getProduct()
    // console.log("sku ~> " + product[0].toNumber())
    // console.log("name ~> " + product[1])
    // console.log("url ~> " + product[2])

    assert.equal(product[0].toNumber(), expectedSku)
  })

  it("should has an owner", async () => {
    assert.equal(await votingInstance.owner.call(), account0);
  })

  it("should vote", async () => {

    await votingInstance.addProduct(123, "Phone", "http://bit.ly/ha7fei")

    await votingInstance.voteProduct(5, account0)
    let poll = await votingInstance.getCounting()
    assert.equal(poll.toNumber(), 1)
  })

  it("should accept votes from different", async () => {

    await votingInstance.addProduct(123, "Phone", "http://bit.ly/ha7fei")

    await votingInstance.voteProduct(5, account0)
    await votingInstance.voteProduct(4, account1)
    await votingInstance.voteProduct(4, account2)

    let poll = await votingInstance.getCounting()
    assert.equal(poll.toNumber(), 3)
  })

  it("should return the sum of votes", async () => {

    await votingInstance.addProduct(123, "Phone", "http://bit.ly/ha7fei")

    let rating1 = 5;
    let rating2 = 3;
    let rating3 = 4;

    let expectedSum = rating1 + rating2 + rating3;

    await votingInstance.voteProduct(rating1, account0)
    await votingInstance.voteProduct(rating2, account1)
    await votingInstance.voteProduct(rating3, account2)

    let getResults = await votingInstance.getResults()
    let ratingSum = getResults[1].toNumber()
    assert.equal(ratingSum, expectedSum)
  })

  it("should have 1000000 initial supply", async () => {
    let expectedSupply = 1000000
    let contractSupply = await votingInstance.totalSupply()

    assert.equal(contractSupply, expectedSupply)
  })

  it("should set 0..5 as a rating", async () => {
    let rating = 4
    return votingInstance.validateRating(rating)
      .then((isValid) => {
        assert.equal(isValid, true)
      })
  })

  it("should be able to replace product", async () => {
    let initialSku = 1;
    let expectedSku = 2;
    await votingInstance.addProduct(initialSku, "First", "http://bit.ly/first")
    await votingInstance.addProduct(expectedSku, "Second", "http://bit.ly/second")
    
    let product = await votingInstance.getProduct()
    assert.equal(product[0].toNumber(), expectedSku)
  })

})