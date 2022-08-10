const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers');
const JSBI = require('jsbi')

require('dotenv').config();

const ERC20ABI = require('./abi.json')
const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"

const { PRIVATE_KEY, PRIVATE_KEY_l, API_URL_rinkeby } = process.env;

const wallet = new ethers.Wallet(PRIVATE_KEY_l)
// const wallet_address = '0xB28EB6F6baafD0b33D64a3fdf47620849Eb2e494'

console.log("Wallet : ",wallet.address)

// const rpcURL = "https://cloudflare-eth.com"
// const web3Provider = new ethers.providers.JsonRpcProvider(rpcURL);

const web3Provider = new ethers.providers.JsonRpcProvider(API_URL_rinkeby)

// const { chainId } = await web3Provider.getNetwork()
// console.log(chainId)
const chainId = 4;

const router = new AlphaRouter({ chainId: chainId, provider: web3Provider })

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xc778417E063141139Fce010982780140Aa0cD5Ab'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

const WETH = new Token(chainId, address0, decimals0, symbol0, name0)
const UNI = new Token(chainId, address1, decimals1, symbol1, name1)

const wei = ethers.utils.parseUnits('0.01', 18)
const inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))

async function main(){
    const route = await router.route(
        inputAmount,
        UNI,
        TradeType.EXACT_INPUT,
        {
            recipient: wallet.address,
            slippageTolerance: new Percent(25, 100),
            deadline: Math.floor(Date.now()/1000 + 1800)
        }
    )
    console.log(`Quote Exact In: ${route.quote.toFixed(10)}`)


    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route.methodParameters.value),
        from: wallet.address,
        gasPrice: BigNumber.from(route.gasPriceWei)
        // gasLimit: ethers.utils.hexlify(1000000)
    }

    const connectedWallet = wallet.connect(web3Provider)
    const approvalAmount = ethers.utils.parseUnits('1',18).toString()

    const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider)
    await contract0.connect(connectedWallet).approve(
        V3_SWAP_ROUTER_ADDRESS,
        approvalAmount
    )

    const tradeTransaction = await connectedWallet.sendTransaction(transaction)
}









main()