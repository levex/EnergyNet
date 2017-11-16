# Balance

## GET `/balance/ether`

Get my ether balance

Response: An object with `balance` field

Example response:

```
{"balance":"6908.734450999999999754 ether"}
```

## GET `/balance/energy`

Get my energy balance (total energy bought)

Response: An object with `balance` field

Example response:

```
{"balance":"0"}
```

# View

## GET `/view/available_contracts`

Get all available contracts that a user can buy energy from

Response: An array of contract objects, with fields `contractAddr`, `unitPrice` and `offeredAmount`

Example response:

```
[{"contractAddr":"0xEA0c294fa0bc9729598193E655229Cb26Fa82224","unitPrice":"1","offeredAmount":"9"}]
```

##GET `/view/my_buyer_contracts`

Get all contracts of which I am a buyer and I have bought and not consumed energy

Response: An array of contract objects, with fields `contractAddr`, `unitPrice`, `remainingAmount`

Example response:

```
[{"contractAddr":"0xEA0c294fa0bc9729598193E655229Cb26Fa82224","unitPrice":"1","remainingAmount":"9"}]
```

## GET `/view/my_seller_contracts`

Get all contracts of which I am a seller

Response: An array of contract objects, with fields `contractAddr`, `unitPrice`, `remainingAmount`

Example response:

```
[{"contractAddr":"0x0d4438dA9cC8DeB51cF94B3e5D75500DB70f8B03","unitPrice":"1","offeredAmount":"10"}]
```

## GET `/view/my_contracts`

Get all contracts of which I am a seller or a buyer

Response: An object with fields `sellerContracts`, `buyerContracts`

Example response:

```
{"sellerContracts":[{"contractAddr":"0x0d4438dA9cC8DeB51cF94B3e5D75500DB70f8B03","unitPrice":"1","offeredAmount":"0"}],"buyerContracts":[{"contractAddr":"0xEA0c294fa0bc9729598193E655229Cb26Fa82224","unitPrice":"1","remainingAmount":"9"}]}
```

# Transaction

## POST `/transaction/buy`

Buy given amount of energy from given contract

Parameter:

 - `contract` Contract address
 - `amount` Energy to buy

Response:

- 200 if a transaction is initiated
- 400 on error

## POST `/transaction/sell`

Sell given amount of energy at given price, creating a contract available for everyone to buy

Parameter:

- `price` Price of energy
- `amount` Energy to sell

Response:

- 200 if a transaction is initiated
- 400 on error

## POST `/transaction/consume`

Consume given amount of energy. If there is not enough energy balance, automatically buy energy starting from cheapest. Consume energy from available contracts starting from cheapest, paying seller required value.

Parameter:

- `price` Price of energy
- `amount` Energy to sell

Response:

- 200 if a transaction is initiated
- 500 on error
