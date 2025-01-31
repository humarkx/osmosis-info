import { makeStyles } from "@material-ui/core"
import { useEffect } from "react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import BlocLoaderOsmosis from "../../components/loader/BlocLoaderOsmosis"
import Paper from "../../components/paper/Paper"
import { useCharts } from "../../contexts/ChartsProvider"
import { useWatchlistTokens } from "../../contexts/WatchlistTokensProvider"
import { useWatchlistPools } from "../../contexts/WatchlistPoolsProvider"
import { getInclude } from "../../helpers/helpers"
import ContainerChartLiquidity from "./ContainerChartLiquidity"
import ContainerChartVolume from "./ContainerChartVolume"
import { usePoolsV2 } from "../../contexts/PoolsV2.provider"
import { useTokensV2 } from "../../contexts/TokensV2.provider"
import PoolsTable from "../pools/poolsTable/poolsTable"
import TokensTable from "../tokens/tokensTable/tokensTable"
import { useSettings } from "../../contexts/SettingsProvider"
import OverviewBar from "./overviewBar/overviewBar"

const useStyles = makeStyles((theme) => {
	return {
		overviewRoot: {
			marginTop: "30px",
			marginBottom: "30px",
			overflowX: "hidden",
			margin: `${theme.spacing(2)}px 0`,
		},
		radiant: {
			position: "absolute",
			top: "0",
			left: "0",
			right: "0",
			height: "200vh",
			opacity: "0.3",
			transform: "translateY(-150vh)",
			mixBlendMode: "color",
			pointerEvents: "none",
			background: `radial-gradient(50% 50% at 50% 60%, ${theme.palette.primary.main} 30%,  ${theme.palette.black.light} 100%)`,
		},
		title: {
			fontSize: "1.6rem",
			color: theme.palette.gray.contrastText,
			marginBottom: "20px",
		},
		subTitle: {
			color: theme.palette.gray.main,
			
		},
		container: {
			display: "grid",
			gridAutoRows: "auto",
			rowGap: theme.spacing(2),
		},
		charts: {
			width: "100%",
			display: "flex",
			justifyContent: "space-between",

			[theme.breakpoints.down("xs")]: {
				flexDirection: "column",
				width: "auto",
				"&>:nth-child(1)": {
					marginBottom: theme.spacing(2),
				},
			},
		},
		chart: {
			position: "relative",
			width: "49%",
			zIndex: "0",
			minHeight: "360px",
			[theme.breakpoints.down("xs")]: {
				width: "100%",
				minHeight: "410px",
			},
		},
		containerChart: { height: "100%" },
		containerLoading: {
			position: "relative",
			minWidth: "200px",
			minHeight: "200px",
		},
		containerWatchlist: {
			position: "relative",
			minWidth: "200px",
		},
	}
})

const Overview = () => {
	const classes = useStyles()
	const { dataLiquidityD, dataLiquidityW, dataLiquidityM, dataVolumeD, dataVolumeW, dataVolumeM, loadingData } =
		useCharts()
	const { watchlistTokens } = useWatchlistTokens()
	const { watchlistPools } = useWatchlistPools()
	const [tokensOnWatchlist, setTokensOnWatchlist] = useState([])
	const [poolsOnWatchlist, setPoolsOnWatchlist] = useState([])

	const { pools, loadingPools } = usePoolsV2()
	const { tokens, loadingTokens } = useTokensV2()
	const [dataPools, setDataPools] = useState([])
	const [dataTokens, setDataTokens] = useState([])
	const history = useHistory()

	const { settings, updateSettings } = useSettings()

	const setSettingsPools = (settings) => {
		updateSettings({ poolTable: settings })
	}

	const setSettingsTokens = (settings) => {
		updateSettings({ tokenTable: settings })
	}

	useEffect(() => {
		// sort pools on the first time is fetched
		let data = [...pools]
		data.sort((a, b) => {
			if (b.liquidity < a.liquidity) {
				return -1
			}
			if (b.liquidity > a.liquidity) {
				return 1
			}
			return 0
		})
		setDataPools(data)
	}, [pools])

	useEffect(() => {
		// sort tokens on the first time is fetched
		let data = [...tokens]
		data.sort((a, b) => {
			if (b.liquidity < a.liquidity) {
				return -1
			}
			if (b.liquidity > a.liquidity) {
				return 1
			}
			return 0
		})
		setDataTokens(data)
	}, [tokens])

	const onClickPool = (pool) => {
		history.push(`/pool/${pool.id}`)
	}

	const onClickToken = (token) => {
		history.push(`/token/${token.symbol}`)
	}

	useEffect(() => {
		let tokensWL = tokens.filter((token) => {
			let index = getInclude(watchlistTokens, (symbol) => {
				return symbol === token.symbol
			})
			return index >= 0
		})
		setTokensOnWatchlist(tokensWL)
	}, [watchlistTokens, tokens])

	useEffect(() => {
		let poolsWL = pools.filter((pool) => {
			let index = getInclude(watchlistPools, (plId) => {
				return plId === pool.id
			})
			return index >= 0
		})
		setPoolsOnWatchlist(poolsWL)
	}, [watchlistPools, pools])

	return (
		<div className={classes.overviewRoot}>
			<div className={classes.container}>
				<p className={classes.title}>Osmosis - Overview</p>
				<div className={classes.charts}>
					<Paper className={classes.chart}>
						<BlocLoaderOsmosis open={loadingData} borderRadius={true} />
						<div className={classes.containerChart}>
							<ContainerChartLiquidity
								dataDay={dataLiquidityD}
								dataWeek={dataLiquidityW}
								dataMonth={dataLiquidityM}
								title="Liquidity"
							/>
						</div>
					</Paper>
					<Paper className={classes.chart}>
						<BlocLoaderOsmosis open={loadingData} borderRadius={true} />
						<div className={classes.containerChart}>
							<ContainerChartVolume
								dataDay={dataVolumeD}
								dataWeek={dataVolumeW}
								dataMonth={dataVolumeM}
								title="Volume"
							/>
						</div>
					</Paper>
				</div>
				<OverviewBar />
				<p className={classes.subTitle}>Your token watchlist</p>
				<Paper className={classes.containerWatchlist}>
					{watchlistTokens.length > 0 ? (
						<TokensTable
							data={tokensOnWatchlist}
							onClickToken={onClickToken}
							setSettings={setSettingsTokens}
							settings={settings.tokenTable}
						/>
					) : (
						<p>Saved tokens will appear here</p>
					)}
				</Paper>
				<p className={classes.subTitle}>Your pool watchlist</p>
				<Paper className={classes.containerWatchlist}>
					{watchlistPools.length > 0 ? (
						<PoolsTable
							data={poolsOnWatchlist}
							onClickPool={onClickPool}
							setSettings={setSettingsPools}
							settings={settings.poolTable}
						/>
					) : (
						<p>Saved pools will appear here</p>
					)}
				</Paper>
				<p className={classes.subTitle}>Top tokens</p>
				<Paper className={classes.containerLoading}>
					<BlocLoaderOsmosis open={loadingTokens} borderRadius={true} />
					<TokensTable
						data={dataTokens}
						onClickToken={onClickToken}
						setSettings={setSettingsTokens}
						settings={settings.tokenTable}
					/>
				</Paper>
				<p className={classes.subTitle}>Top pools</p>
				<Paper className={classes.containerLoading}>
					<BlocLoaderOsmosis open={loadingPools} borderRadius={true} />
					<PoolsTable
						data={dataPools}
						onClickPool={onClickPool}
						setSettings={setSettingsPools}
						settings={settings.poolTable}
					/>
				</Paper>
			</div>
		</div>
	)
}

export default Overview
