# Offline Wallet

# Aim

To enable users to transact and make payments in a scenario where a merchant has internet, but not the customer.

# Rationale

---

In Vitalik’s blog post “Some personal user experiences”, on Feb. 28th 2023, he explains an interaction with a merchant in a sushi restaurant, where he tries to pay for his meal with BTC. However, he did not have a reliable internet connection, and quoting him, “*customer internet is less reliable than merchant internet*”. 

The following report shows us the countries with the highest P2P exchange trade volume: https://blog.chainalysis.com/reports/2022-global-crypto-adoption-index/

Countries such as India, Brazil, Thailand and Indonesia, do not always have reliable internet connections, and even areas without mobile data coverage. In rural areas for example, where service/internet may not be available, users are unable to make transactions to each other and thus, unable to pay for coffee, or goods using crypto etc. However, as mentioned before, merchants themselves will definitely have a better internet connection than the customer. As Vitalik says in his blogpost, “*We need in-person payment systems to have some functionality (NFC, customer shows a QR code, whatever) to allow customers to transfer their transaction data directly to the merchant if that's the best way to get it broadcasted*”.

# Solution

---

Introducing Offline Wallet, an QR code-enabled and offline Ethereum wallet. It allows single payment transaction signatures from a customer to be executed on a merchant’s phone by using QR codes.

**Usage (User Experience)**: 

- A merchant enters payment details and creates a QR Code to show to the customer
- The customer scans the QR code, receives the transaction information, and selects which token and chain to pay with. The customer signs this transaction with their private key, in which an internet connection is not required
- The customer writes the transaction signature to an QR code using
- The merchant reads the signature on the QR code, and sends this transaction.

******************Security:******************

There are no risks associated to putting a transaction on an QR code in terms of a merchant obtaining access to the user’s wallet, as a signature is written to the chip. Furthermore, this transaction has a nonce, meaning that if the QR code is shared, that transaction can only be executed once, since the signature cannot be updated with another nonce unless the customer signs another transaction on their phone.

**Cross-chain payments**: ****

In most cases, the customer will probably not have the same token or assets the same chain that the merchant wants. In order to make the user experience as seamless as possible, the tokens need to be bridged and/or swapped during the payment. 

Hyperlane’s Messaging API for token bridging and swapping on a DEX can be used to achieve this. A user’s signed transaction would be a multicall or a call to a proxy contract. Here it is, deconstructed:


1. Swap & Bridge:
    1. Approving
    2. using getAmountIn to find out how many tokens we need to transfer
    3. use the permit signature somewhere in here to approve the proxy contract taking our tokens
    4. call safeTransferFrom from my account to the proxy account (deposit tokens to proxy account)
    5. approve the uniswap router to spend the deposited tokens
    6. swap
    7. Bridging functionality with Hyperlane
