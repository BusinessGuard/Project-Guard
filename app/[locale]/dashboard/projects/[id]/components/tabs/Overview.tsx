import { RadarChartView } from './RadarChartView'
import { BlockScores } from './BlockScores'
export const Overview = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <RadarChartView />
      <BlockScores />
    </div>
  )
}