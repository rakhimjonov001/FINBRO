"use client"

import { Wallet, ArrowUpDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Currency {
  value: string
  label: string
}

interface DashboardMainProps {
  onCurrencyChange: (currency: string) => void
}

function Dashboard_main({ onCurrencyChange }: DashboardMainProps) {
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('UZS')
  const [amount, setAmount] = useState<string>('1')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [currencies, setCurrencies] = useState<Currency[]>([
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'RUB', label: 'RUB - Russian Ruble' },
    { value: 'UZS', label: 'UZS - Uzbek Som' },
    { value: 'KZT', label: 'KZT - Kazakhstani Tenge' },
    { value: 'KRW', label: 'KRW - South Korean Won' },
    { value: 'SGD', label: 'SGD - Singapore Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'TRY', label: 'TRY - Turkish Lira' },
  ])

  useEffect(() => {
    const fetchSymbols = async (): Promise<void> => {
      const url = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/symbols'
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f9076c01c4mshbcdcb1af0826520p1f0dbejsn86ba59260b4d',
          'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
        }
      }

      try {
        const response = await fetch(url, options)
        const result = await response.json()

        if (result.symbols) {
          const currencyList: Currency[] = Object.entries(result.symbols).map(([code, name]) => ({
            value: code,
            label: `${code} - ${name as string}`
          }))
          setCurrencies(currencyList)
        }
      } catch (error) {
        console.error('Error fetching symbols:', error)
      }
    }

    fetchSymbols()
  }, [])

  const convertCurrency = async (): Promise<void> => {
    if (!amount || parseFloat(amount) <= 0) {
      setConvertedAmount('')
      return
    }

    setLoading(true)
    setError('')

    const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'f9076c01c4mshbcdcb1af0826520p1f0dbejsn86ba59260b4d',
        'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
      }
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()

      if (result.result) {
        setConvertedAmount(result.result.toFixed(2))
      } else {
        throw new Error('Invalid response')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      setError('Conversion failed')
      setConvertedAmount('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertCurrency()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [fromCurrency, toCurrency, amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const swapCurrencies = (): void => {
    const newFromCurrency = toCurrency
    const newToCurrency = fromCurrency
    setFromCurrency(newFromCurrency)
    setToCurrency(newToCurrency)
    onCurrencyChange(newFromCurrency)
  }

  const handleFromCurrencyChange = (newCurrency: string): void => {
    setFromCurrency(newCurrency)
    onCurrencyChange(newCurrency)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between p-6 bg-[#0D0D0D] rounded-2xl">
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="p-2 bg-[#1A1A1A] rounded-lg">
          <Wallet className="h-6 w-6 text-[#86efac]" />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm">Currency</span>
          <span className="text-white font-semibold text-lg">Converter</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Input Amount - высота 56px */}
          <div className="flex-1 min-w-[120px]">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full h-14 bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-[#86efac] text-center"
            />
          </div>


          <div className="w-32">
            <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
              <SelectTrigger className="w-full min-h-14 bg-[#1A1A1A] border-gray-700 text-white text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-gray-700 text-white max-h-60">
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className="text-sm">
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <button
            onClick={swapCurrencies}
            className="p-3 h-14 w-14 bg-[#1A1A1A] border border-gray-700 rounded-xl hover:bg-[#2A2A2A] transition-colors flex items-center justify-center flex-shrink-0"
            title="Swap currencies"
          >
            <ArrowUpDown className="h-5 w-5 text-gray-400" />
          </button>


          <div className="w-32 h-14">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full min-h-14 bg-[#1A1A1A] border-gray-700 text-white text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-gray-700 text-white max-h-60">
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className="text-sm">
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className="flex-1 min-w-[150px]">
            <div className="w-full h-14 bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-semibold flex items-center justify-center">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#86efac]"></div>
                </div>
              ) : error ? (
                <span className="text-red-400 text-xs">{error}</span>
              ) : convertedAmount ? (
                <span className="text-[#86efac] text-lg font-bold">
                  {convertedAmount} {toCurrency}
                </span>
              ) : (
                <span className="text-gray-500 text-base">0 {toCurrency}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard_main