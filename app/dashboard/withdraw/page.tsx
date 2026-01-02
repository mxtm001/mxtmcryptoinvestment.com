"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  CreditCard,
  Smartphone,
  Wallet,
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Check,
} from "lucide-react"
import { userService } from "@/lib/user-service"

interface CryptoCurrency {
  value: string
  label: string
  symbol: string
  network: string
  icon: string
}

const cryptocurrencies: CryptoCurrency[] = [
  { value: "BTC", label: "Bitcoin", symbol: "BTC", network: "Bitcoin Network", icon: "₿" },
  { value: "ETH", label: "Ethereum", symbol: "ETH", network: "Ethereum Network", icon: "Ξ" },
  { value: "USDT", label: "Tether", symbol: "USDT", network: "ERC-20 / TRC-20", icon: "₮" },
  { value: "USDC", label: "USD Coin", symbol: "USDC", network: "ERC-20", icon: "$" },
  { value: "BNB", label: "Binance Coin", symbol: "BNB", network: "BSC Network", icon: "BNB" },
  { value: "XRP", label: "Ripple", symbol: "XRP", network: "XRP Ledger", icon: "XRP" },
  { value: "ADA", label: "Cardano", symbol: "ADA", network: "Cardano Network", icon: "₳" },
  { value: "SOL", label: "Solana", symbol: "SOL", network: "Solana Network", icon: "◎" },
  { value: "DOGE", label: "Dogecoin", symbol: "DOGE", network: "Dogecoin Network", icon: "Ð" },
  { value: "DOT", label: "Polkadot", symbol: "DOT", network: "Polkadot Network", icon: "DOT" },
  { value: "MATIC", label: "Polygon", symbol: "MATIC", network: "Polygon Network", icon: "MATIC" },
  { value: "LTC", label: "Litecoin", symbol: "LTC", network: "Litecoin Network", icon: "Ł" },
  { value: "SHIB", label: "Shiba Inu", symbol: "SHIB", network: "ERC-20", icon: "SHIB" },
  { value: "TRX", label: "TRON", symbol: "TRX", network: "TRON Network", icon: "TRX" },
  { value: "AVAX", label: "Avalanche", symbol: "AVAX", network: "Avalanche C-Chain", icon: "AVAX" },
]

interface BankDetails {
  accountName: string
  accountNumber: string
  bankName: string
  swiftCode: string
}

interface PixDetails {
  pixKey: string
  accountHolder: string
  bank: string
}

interface CryptoDetails {
  cryptocurrency: string
  walletAddress: string
  network: string
}

interface PaypalDetails {
  email: string
}

const brazilianBanks = [
  // Major Banks
  { value: "001", label: "Banco do Brasil" },
  { value: "033", label: "Banco Santander" },
  { value: "104", label: "Caixa Econômica Federal" },
  { value: "237", label: "Bradesco" },
  { value: "341", label: "Itaú Unibanco" },
  { value: "422", label: "Banco Safra" },
  { value: "745", label: "Banco Citibank" },

  // Mid-Size Banks
  { value: "246", label: "Banco ABC Brasil" },
  { value: "336", label: "Banco C6" },
  { value: "355", label: "Banco Votorantim" },
  { value: "389", label: "Banco Merrill Lynch" },
  { value: "612", label: "Banco Guanabara" },
  { value: "654", label: "Banco Forjadores" },
  { value: "743", label: "Banco Semear" },
  { value: "846", label: "Banco Cooperativo do Brasil" },

  // Digital and Investment Banks
  { value: "260", label: "NU Pagamentos S.A. (Nubank)" },
  { value: "655", label: "Banco de Investimentos Crédit Suisse" },
  { value: "288", label: "Caruana S/A - Banco de Investimentos" },
  { value: "318", label: "Banco BMG S.A." },
  { value: "329", label: "Banco Ita Portfolio S.A." },
  { value: "330", label: "Banco Itauleasing S.A." },
  { value: "652", label: "Itaú Corretora de Valores S.A." },

  // Cooperative Banks
  { value: "748", label: "Banco Cooperativo Sicredi S.A." },
  { value: "756", label: "Banco Cooperativo do Brasil S.A." },

  // Savings and Loan Banks
  { value: "102", label: "Caixa Geral de Depósitos" },
  { value: "376", label: "Banco J.P. Morgan S.A." },
  { value: "383", label: "Banco Volkswagen S.A." },
  { value: "409", label: "Banco UNIPRIME Brasil S.A." },
  { value: "413", label: "Banco VR S.A." },
  { value: "464", label: "Banco STP S.A." },

  // International Banks
  { value: "004", label: "Banco de Desenvolvimento Econômico e Social" },
  { value: "037", label: "Banco Interamericano de Desenvolvimento" },
  { value: "456", label: "Banco MUFG Brasil S.A." },
  { value: "492", label: "Banco IW Bank S.A." },

  // Regional and Community Banks
  { value: "070", label: "Banco de Brasília" },
  { value: "082", label: "Banco Topázio S.A." },
  { value: "142", label: "Banco Finterra S.A." },
  { value: "163", label: "Banco Fluxo S.A." },
  { value: "630", label: "Banco Intercam S.A." },
  { value: "634", label: "Banco Tripe S.A." },

  // Specialized Banks
  { value: "035", label: "Banco Bradesco BBI S.A." },
  { value: "076", label: "Banco K.B.S. S.A." },
  { value: "343", label: "Ita Portfolio S.A." },
  { value: "349", label: "Banco Itauleasing S.A." },

  // Payment Banks
  { value: "626", label: "Banco Ficsa S.A." },
  { value: "680", label: "Banco Finterra S.A." },
  { value: "808", label: "Banco Mercantil do Brasil S.A." },

  // Other
  { value: "999", label: "Outro Banco" },
]

const germanBanks = [
  { value: "deutsche-bank", label: "Deutsche Bank AG" },
  { value: "commerzbank", label: "Commerzbank AG" },
  { value: "dresdner", label: "Dresdner Bank" },
  { value: "hypo-vereinsbank", label: "HypoVereinsbank" },
  { value: "westdeutsche-landesbank", label: "Westdeutsche Landesbank" },
  { value: "norddeutsche-landesbank", label: "Norddeutsche Landesbank" },
  { value: "landesbank-berlin", label: "Landesbank Berlin" },
  { value: "bayerische-landesbank", label: "Bayerische Landesbank" },
  { value: "nord-lb", label: "Nord LB" },
  { value: "sachsen-lb", label: "Sachsen LB" },
  { value: "westlb", label: "Westdeutsche Landesbank (WestLB)" },
  { value: "sparkasse", label: "Sparkasse" },
  { value: "ing-diba", label: "ING-DiBa" },
  { value: "comdirect", label: "Comdirect Bank" },
  { value: "ing", label: "ING" },
  { value: "consorsbank", label: "Consorsbank" },
  { value: "flatex", label: "Flatex" },
  { value: "dkb", label: "Deutsche Kreditbank (DKB)" },
  { value: "santander", label: "Santander Consumer Bank" },
  { value: "hsbc", label: "HSBC Germany" },
  { value: "ubs", label: "UBS Deutschland" },
  { value: "credit-suisse", label: "Credit Suisse Deutschland" },
  { value: "jp-morgan", label: "JPMorgan Chase Bank" },
  { value: "goldman-sachs", label: "Goldman Sachs Bank" },
  { value: "deutsche-boerse", label: "Deutsche Börse" },
  { value: "postbank", label: "Postbank" },
  { value: "targobank", label: "Targobank" },
  { value: "fidor", label: "Fidor Bank" },
  { value: "revolut", label: "Revolut Bank" },
  { value: "wise", label: "Wise (TransferWise)" },
  { value: "bunq", label: "Bunq" },
  { value: "n26", label: "N26" },
]

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank")
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    swiftCode: "",
  })
  const [pixDetails, setPixDetails] = useState<PixDetails>({
    pixKey: "",
    accountHolder: "",
    bank: "",
  })
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    cryptocurrency: "BTC",
    walletAddress: "",
    network: "Bitcoin Network",
  })
  const [paypalDetails, setPaypalDetails] = useState<PaypalDetails>({
    email: "",
  })
  const [showModal, setShowModal] = useState(false)
  const [showTopupMessage, setShowTopupMessage] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await userService.getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      currentUser.balance = 150000000
      setUser(currentUser)
      setLoading(false)
    }

    loadUser()
  }, [router])

  const balance = 150000000

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowTopupMessage(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const handleCryptoChange = (value: string) => {
    const selectedCrypto = cryptocurrencies.find((c) => c.value === value)
    setCryptoDetails({
      ...cryptoDetails,
      cryptocurrency: value,
      network: selectedCrypto?.network || "",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9a826]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1222]">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8 flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-[#f9a826] to-yellow-400 rounded-lg">
              <Wallet className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mittel abheben
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Heben Sie Ihre Gewinne sicher auf Ihrem bevorzugten Konto ab</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 overflow-hidden relative group hover:border-[#f9a826]/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f9a826]/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Verfügbarer Saldo</CardTitle>
              <div className="p-2 bg-[#f9a826]/10 rounded-lg">
                <Wallet className="h-4 w-4 text-[#f9a826]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#f9a826] to-yellow-400 bg-clip-text text-transparent">
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 text-green-400" />
                Zur Abhebung bereit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 overflow-hidden relative group hover:border-blue-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Verarbeitungszeit</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">1-3 Tage</div>
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <Zap className="h-3 w-3 mr-1 text-blue-400" />
                Schnelle Verarbeitung
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 overflow-hidden relative group hover:border-green-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Abhebungslimit</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">Unbegrenzt</div>
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <Globe className="h-3 w-3 mr-1 text-green-400" />
                Keine Einschränkungen
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 shadow-2xl">
          <CardHeader className="border-b border-[#253256]/50 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white">Abhebung anfordern</CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Wählen Sie Ihre bevorzugte Abhebungsmethode und geben Sie Ihre Daten ein
                </CardDescription>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#f9a826]/10 to-yellow-400/10 rounded-lg">
                <Shield className="h-8 w-8 text-[#f9a826]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-white text-base font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-[#f9a826]" />
                  Abhebungsbetrag (EUR)
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">€</div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Betrag eingeben"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 h-14 bg-[#162040]/50 border-[#253256] text-white text-lg focus:border-[#f9a826] transition-colors"
                    required
                    min="100"
                    max={balance}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-400">Verfügbarer Saldo:</p>
                  <p className="text-[#f9a826] font-semibold">{formatCurrency(balance)}</p>
                </div>
              </div>

              <Tabs value={withdrawalMethod} onValueChange={setWithdrawalMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[#162040]/50 p-1 gap-1">
                  <TabsTrigger
                    value="bank"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f9a826] data-[state=active]:to-yellow-400 data-[state=active]:text-black flex items-center gap-2 py-3"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Bank</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pix"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f9a826] data-[state=active]:to-yellow-400 data-[state=active]:text-black flex items-center gap-2 py-3"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="hidden sm:inline">PIX</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="crypto"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f9a826] data-[state=active]:to-yellow-400 data-[state=active]:text-black flex items-center gap-2 py-3"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">Krypto</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="paypal"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f9a826] data-[state=active]:to-yellow-400 data-[state=active]:text-black flex items-center gap-2 py-3"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">PayPal</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bank" className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="germanBank" className="text-white">
                      Wählen Sie Ihre Bank
                    </Label>
                    <Select
                      value={bankDetails.bankName}
                      onValueChange={(value) => {
                        const bank = germanBanks.find((b) => b.value === value)
                        setBankDetails({ ...bankDetails, bankName: value, swiftCode: "" })
                      }}
                    >
                      <SelectTrigger
                        id="germanBank"
                        className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      >
                        <SelectValue placeholder="Wählen Sie Ihre Bank" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#162040] border-[#253256] text-white max-h-96">
                        {germanBanks.map((bank) => (
                          <SelectItem
                            key={bank.value}
                            value={bank.value}
                            className="focus:bg-[#253256] focus:text-white"
                          >
                            {bank.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="accountName" className="text-white">
                        Name des Kontoinhabers
                      </Label>
                      <Input
                        id="accountName"
                        placeholder="Vollständiger Name wie bei der Bank"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                        className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-white">
                        Kontonummer / IBAN
                      </Label>
                      <Input
                        id="accountNumber"
                        placeholder="Ihre IBAN (z.B. DE89 3704 0044 0532 0130 00)"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                        className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode" className="text-white">
                      SWIFT/BIC-Code
                    </Label>
                    <Input
                      id="swiftCode"
                      placeholder="SWIFT oder BIC Code (z.B. DEUTDEDE)"
                      value={bankDetails.swiftCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                      className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="pix" className="space-y-5 mt-6">
                  <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>PIX-Abhebungen werden sofort auf Ihr Konto verarbeitet</AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="pixBank" className="text-white">
                      Wählen Sie Ihre Bank
                    </Label>
                    <Select
                      value={pixDetails.bank}
                      onValueChange={(value) => setPixDetails({ ...pixDetails, bank: value })}
                    >
                      <SelectTrigger
                        id="pixBank"
                        className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      >
                        <SelectValue placeholder="Wählen Sie Ihre Bank" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#162040] border-[#253256] text-white">
                        {brazilianBanks.map((bank) => (
                          <SelectItem
                            key={bank.value}
                            value={bank.value}
                            className="focus:bg-[#253256] focus:text-white"
                          >
                            {bank.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pixKey" className="text-white">
                      PIX-Schlüssel
                    </Label>
                    <Input
                      id="pixKey"
                      placeholder="Geben Sie Ihren PIX-Schlüssel ein"
                      value={pixDetails.pixKey}
                      onChange={(e) => setPixDetails({ ...pixDetails, pixKey: e.target.value })}
                      className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixHolder" className="text-white">
                      Name des Kontoinhabers
                    </Label>
                    <Input
                      id="pixHolder"
                      placeholder="Vollständiger Name"
                      value={pixDetails.accountHolder}
                      onChange={(e) => setPixDetails({ ...pixDetails, accountHolder: e.target.value })}
                      className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="space-y-5 mt-6">
                  <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Kryptoabhebungen werden in 1-2 Stunden verarbeitet. Überprüfen Sie die Wallet-Adresse und das
                      Netzwerk.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="cryptocurrency" className="text-white">
                      Wählen Sie die Kryptowährung
                    </Label>
                    <Select value={cryptoDetails.cryptocurrency} onValueChange={handleCryptoChange}>
                      <SelectTrigger
                        id="cryptocurrency"
                        className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      >
                        <SelectValue placeholder="Wählen Sie Kryptowährung" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#162040] border-[#253256] text-white">
                        {cryptocurrencies.map((crypto) => (
                          <SelectItem
                            key={crypto.value}
                            value={crypto.value}
                            className="focus:bg-[#253256] focus:text-white"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{crypto.icon}</span>
                              <div>
                                <div className="font-semibold">{crypto.label}</div>
                                <div className="text-xs text-gray-400">{crypto.network}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Netzwerk: {cryptoDetails.network || "Wählen Sie eine Kryptowährung"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="walletAddress" className="text-white">
                      Wallet-Adresse
                    </Label>
                    <Input
                      id="walletAddress"
                      placeholder={`Geben Sie Ihre ${cryptoDetails.cryptocurrency} Wallet-Adresse ein`}
                      value={cryptoDetails.walletAddress}
                      onChange={(e) => setCryptoDetails({ ...cryptoDetails, walletAddress: e.target.value })}
                      className="bg-[#162040]/50 border-[#253256] text-white h-12 font-mono text-sm focus:border-[#f9a826]"
                      required
                    />
                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Stellen Sie sicher, dass Sie das korrekte Netzwerk verwenden: {cryptoDetails.network}
                    </p>
                  </div>

                  <Alert className="border-yellow-500/30 bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300 text-sm">
                      <strong>Wichtig:</strong> Das Senden von Mitteln an das falsche Netzwerk kann zum Verlust führen.
                      Überprüfen Sie immer, ob das Netzwerk Ihrer Wallet entspricht.
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 bg-[#162040]/50 rounded-lg border border-[#253256] space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#f9a826]" />
                      Details der ausgewählten Kryptowährung
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-400">Münze</span>
                        <div className="font-semibold text-white mt-1">
                          {cryptocurrencies.find((c) => c.value === cryptoDetails.cryptocurrency)?.label ||
                            "Nicht ausgewählt"}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Netzwerk</span>
                        <div className="font-semibold text-white mt-1">
                          {cryptoDetails.network || "Nicht ausgewählt"}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="space-y-5 mt-6">
                  <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>PayPal-Abhebungen werden innerhalb von 24 Stunden verarbeitet</AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail" className="text-white">
                      PayPal-E-Mail
                    </Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="Ihre PayPal-E-Mail"
                      value={paypalDetails.email}
                      onChange={(e) => setPaypalDetails({ ...paypalDetails, email: e.target.value })}
                      className="bg-[#162040]/50 border-[#253256] text-white h-12 focus:border-[#f9a826]"
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Sichere Transaktion</p>
                  <p className="text-xs text-gray-300">
                    Alle Transaktionen sind verschlüsselt und geschützt. Ihre Informationen sind bei uns sicher.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#f9a826] to-yellow-400 hover:from-[#f9a826]/90 hover:to-yellow-400/90 text-black font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                disabled={processing || balance === 0}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Verarbeitung...
                  </>
                ) : balance === 0 ? (
                  <>Kein Saldo verfügbar</>
                ) : (
                  <>
                    Abhebung anfordern
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md animate-pulse" />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full blur-md animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>

            <div className="relative p-6 space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              <DialogHeader className="text-center space-y-2">
                <DialogTitle className="text-2xl font-bold text-white">Abhebung erfolgreich</DialogTitle>
                <DialogDescription className="sr-only">Ihre Abhebung wurde erfolgreich verarbeitet</DialogDescription>
              </DialogHeader>

              <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <p className="text-center leading-relaxed">
                  <strong className="block text-lg mb-2 text-white">Abhebung verarbeitet</strong>
                  <span className="text-gray-300">
                    Ihr Abhebungsantrag in Höhe von{" "}
                    <strong className="text-green-400">{formatCurrency(Number.parseFloat(amount) || 0)}</strong> wurde
                    erfolgreich verarbeitet.
                  </span>
                </p>
              </div>

              <div className="text-center py-3 bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-lg border border-green-500/20">
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className="text-lg font-bold text-green-400">Erfolgreich ✓</div>
              </div>

              <Button
                onClick={() => setShowModal(false)}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg"
              >
                Schließen
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showTopupMessage} onOpenChange={setShowTopupMessage}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-purple-500/40">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-purple-500 via-pink-400 to-blue-400 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-2xl animate-pulse opacity-50"
                style={{ animationDelay: "2s" }}
              />
            </div>

            <div className="relative p-8 space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-lg animate-pulse" />
                  <div
                    className="relative p-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <DialogHeader className="text-center space-y-3">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Aktivierung erforderlich!
                </DialogTitle>
                <DialogDescription className="sr-only">Account activation required</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-xl border-2 border-purple-500/40 backdrop-blur-sm">
                  <p className="text-center text-white leading-relaxed">
                    <span className="block text-sm text-gray-200 mb-3">Um mehr Aktivitäten zu entsperren</span>
                    <span className="block text-5xl font-black bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent my-3">
                      €30.000
                    </span>
                    <span className="block text-gray-300 font-semibold">Top-Up erforderlich</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg border border-blue-500/30 text-center">
                    <div className="text-xl mb-1">🚀</div>
                    <div className="text-xs text-blue-300 font-semibold">Schneller Zugang</div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-transparent rounded-lg border border-purple-500/30 text-center">
                    <div className="text-xl mb-1">💎</div>
                    <div className="text-xs text-purple-300 font-semibold">Premium Features</div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-pink-500/20 to-transparent rounded-lg border border-pink-500/30 text-center">
                    <div className="text-xl mb-1">⚡</div>
                    <div className="text-xs text-pink-300 font-semibold">Unbegrenzt</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                  <p className="text-center text-sm text-yellow-200">
                    <strong className="block mb-1">💡 Hinweis:</strong>
                    Nach dem Top-Up erhalten Sie sofortigen Zugang zu allen erweiterten Funktionen und unbegrenzten
                    Aktivitäten.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowTopupMessage(false)}
                  className="flex-1 h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Später
                </Button>
                <Button
                  onClick={() => {
                    setShowTopupMessage(false)
                    window.location.href = "/dashboard/deposit"
                  }}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                >
                  Jetzt einzahlen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
