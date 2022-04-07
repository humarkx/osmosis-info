import { makeStyles } from "@material-ui/core"
import { useEffect, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { formaterNumber, getPercent } from "../../../../helpers/helpers"
const useStyles = makeStyles((theme) => {
	return {
		resultContainer: {
			backgroundColor: theme.palette.primary.main,
			borderRadius: "10px",
			padding: "10px",
		},
		resultTitle: {
			color: theme.palette.primary.contrastText,
			textTransform: "uppercase",
			margin: "10px 0",
			fontSize: "0.9rem",
		},
		rowTotal: {
			display: "grid",
			gridTemplateColumns: "20px 100px 130px 130px 60px",
			alignItems: "center",
			gridGap: "0",
			justifyItems: "end",
			margin: "4px 0",
		},
		row: {
			display: "grid",
			gridTemplateColumns: "20px 100px 130px 130px 60px",
			gridGap: "0",
			alignItems: "center",
			justifyItems: "end",
			margin: "4px 0",
		},
		item: {
			fontSize: "0.9rem",
			color: theme.palette.gray.textDark,
		},

		itemInfo: {
			paddingLeft: "8px",
			fontSize: "0.9rem",
			color: theme.palette.gray.textDark,
			justifySelf: "start",
		},
		itemInfoTotal: {
			fontSize: "0.9rem",
			color: theme.palette.gray.textDark,
			justifySelf: "start",
		},

		itemPercent: {
			fontSize: "0.7rem",
			color: theme.palette.gray.textDark,
		},

		itemTotal: {
			fontSize: "1rem",
			color: theme.palette.gray.textDark,
		},
		itemUSDTotal: {
			color: theme.palette.green.subText,
			fontSize: "1rem",
		},
		itemUSD: {
			color: theme.palette.green.subText,
			fontSize: "0.9rem",
		},
		itemResult: {
			fontSize: "1rem",
			marginTop: "4px",
		},

		dropdown: {
			maxHeight: "0px",
			overflow: "hidden",
			transition: "all 0.3s",
			display: "flex",
			flexDirection: "column",
		},
		dropdownOpened: {
			maxHeight: "300px",
		},
		arrowIcon: {
			transform: "rotate(0deg)",
			color: theme.palette.gray.textDark,
			cursor: "pointer",
			transition: "all 0.3s !important",
		},
		arrowIconOpened: {
			transform: "rotate(180deg)",
		},
	}
})
const TotalAPR = ({ apr, periode, staked }) => {
	const classes = useStyles()
	const [open, setOpen] = useState(true)

	const [total, setTotal] = useState({ osmo: 0, usd: 0, percent: 0 })
	const [internal, setInternal] = useState({ osmo: 0, usd: 0, percent: 0 })
	const [external, setExternal] = useState({ external: 0, usd: 0, percent: 0, symbol: "" })
	const [hasExternal, setHasExternal] = useState(false)

	useEffect(() => {
		const hasExternalTMP = !!apr.external
		getTotal(hasExternalTMP)
		getInternal(hasExternalTMP)
		if (hasExternalTMP) {
			getExternal()
			setHasExternal(true)
		}
	}, [apr, periode, staked])

	const getPeriode = (apr) => {
		if (periode === 1) {
			return apr.apr1d
		} else if (periode === 7) {
			return apr.apr7d
		}
		return apr.apr14d
	}

	const getTotal = (hasExternal) => {
		let res = { osmo: 0, usd: 0, percent: 0 }
		let currentApr = getPeriode(apr.internal) / 100 + (hasExternal ? getPeriode(apr.external) / 100 : 0)
		res.percent = currentApr
		res.usd = (currentApr * parseFloat(staked)) / 365
		res.osmo = res.usd / apr.internal.token.price

		setTotal(res)
		return res
	}

	const getInternal = (hasExternal) => {
		let res = { osmo: 0, usd: 0, percent: 0 }
		let currentApr = getPeriode(apr.internal)
		res.percent = currentApr
		res.usd = ((currentApr / 100) * parseFloat(staked)) / 365
		res.osmo = res.usd / apr.internal.token.price
		setInternal(res)
		return res
	}

	const getExternal = () => {
		let res = { external: 0, usd: 0, percent: 0, symbol: "" }
		if (apr.external.token) {
			res.symbol = apr.external.token.symbol
		}
		let currentApr = getPeriode(apr.external)
		res.percent = currentApr
		res.usd = ((currentApr / 100) * parseFloat(staked)) / 365
		res.external = res.usd / apr.external.token.price
		setExternal(res)
		return res
	}

	const switchDropdown = () => setOpen(!open)
	return (
		<div className={classes.resultContainer}>
			<p className={classes.resultTitle}>Roi at current rates</p>
			<div className={`${classes.rowTotal}`} onClick={switchDropdown}>
				<ArrowDropDownIcon className={`${classes.arrowIcon} ${open ? classes.arrowIconOpened : null}`} />
				<p className={` ${classes.itemTotal} ${classes.itemInfoTotal}`}>Total daily</p>
				<p className={` ${classes.itemTotal} ${classes.itemUSDTotal}`}>${formaterNumber(total.usd)}</p>
				<p className={` ${classes.itemTotal}`}>{formaterNumber(total.osmo)} OSMO</p>
				<p className={`${classes.itemPercent}`}>({getPercent(total.percent)})</p>
			</div>
			<div className={`${classes.dropdown} ${open ? classes.dropdownOpened : null}`}>
				<div className={classes.row}>
					<span></span>
					<p className={`${classes.item} ${classes.itemInfo}`}>Internal daily</p>
					<p className={`${classes.item} ${classes.itemUSD}`}>${formaterNumber(internal.usd)}</p>
					<p className={`${classes.item}`}>{formaterNumber(internal.osmo)} OSMO</p>
					<p className={`${classes.itemPercent}`}>({getPercent(internal.percent)})</p>
				</div>
				{hasExternal && (
					<div className={classes.row}>
						<span></span>
						<p className={`${classes.item} ${classes.itemInfo}`}>External daily</p>
						<p className={`${classes.item} ${classes.itemUSD}`}>${formaterNumber(external.usd)}</p>
						<p className={`${classes.item}`}>
							{formaterNumber(external.external)} {external.symbol}
						</p>
						<p className={`${classes.itemPercent}`}>({getPercent(external.percent)})</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default TotalAPR