import { Calendar, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"


interface PerformanceChartProps {
  currency: string
}


interface ChartPoint {
  date: string
  price: number
  fullDate: string
}


export function PerformanceChart({ currency }: PerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [period, setPeriod] = useState('1Y')

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true)
      
      const endDate = new Date()
      const startDate = new Date()
      
      switch(period) {
        case '1D':
          startDate.setDate(startDate.getDate() - 1)
          break
        case '1M':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case '3M':
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case '6M':
          startDate.setMonth(startDate.getMonth() - 6)
          break
        case '1Y':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
      }

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]
      const token = import.meta.env.VITE_TOKEN

      const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries?start_date=${startDateStr}&end_date=${endDateStr}&base=USD&symbols=${currency}`
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': `${token}`,
          'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
        }
      }

      try {
        const response = await fetch(url, options)
        const result = await response.json()
        
        if (result.rates) {
          const formattedData = Object.entries(result.rates).map(([date, rates]: [string, any]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: rates[currency] || 0,
            fullDate: date
          }))
          
          formattedData.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
          
          setChartData(formattedData)
        }
      } catch (error) {
        console.error('Error fetching historical data:', error)
        setChartData([
          { date: "Start", price: 1.0, fullDate: "" },
          { date: "End", price: 1.0, fullDate: "" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [currency, period])

  const prices = chartData.map(d => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.95 : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.05 : 100

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#0D0D0D] rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-2 lg:gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-white">Performance</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#333]">
            <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">$</span>
            </div>
            <span className="text-sm font-medium text-white">USD → {currency}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1">
            {['1D', '1M', '3M', '6M', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 md:px-2 lg:px-3 py-1 text-sm md:text-xs lg:text-sm rounded-md transition-colors ${
                  period === p 
                    ? 'bg-[#2A2A2A] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white bg-[#1A1A1A] rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white bg-[#1A1A1A] rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#86efac]"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#86efac" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#86efac" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                orientation="left" 
                tick={{ fill: '#666' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1A1A1A] border border-[#333] p-2 rounded-lg shadow-xl">
                        <p className="text-white font-medium">
                          {payload[0].value?.toFixed(4)} {currency} <span className="text-gray-400 text-sm ml-2">{payload[0].payload.date}</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#86efac" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
