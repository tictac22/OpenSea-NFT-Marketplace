import SearchIcon from "@mui/icons-material/Search"
import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import debounce from "lodash.debounce"
import Link from "next/link"
import React, { useCallback, useState } from "react"
import { APP_ID } from "../../constants"
import { NFTByName } from "../../interfaces/nft"

const getNFTByName = async (title: string) => {
	if (!title || !title.trim()) return []
	const results = await fetch(
		`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getNFTbyTitle?_ApplicationId=${APP_ID}d&title=${title}`
	)
	const response = await results.json()
	return response.result
}

const SearchBar: React.FC = () => {
	const [inputValue, setInputValue] = useState<string>("")
	const [searchData, setSearchData] = useState<readonly NFTByName[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const handleClick = (): void => {
		setInputValue("")
	}
	const handleChange = (e: React.SyntheticEvent<Element, Event>) => {
		setInputValue(e?.target.value)
		setLoading(true)
		handleDebounce(e?.target.value)
	}
	const handleDebounce = useCallback(
		debounce(async (value) => {
			const data = await fetch(`api/getnftbyname?title=${value}`)
			const result = await data.json()
			setSearchData(result.result)
			setLoading(false)
		}, 100),
		[]
	)
	return (
		<Autocomplete
			disablePortal
			freeSolo
			disabled={true}
			blurOnSelect={true}
			filterOptions={(x) => x}
			inputValue={inputValue || ""}
			onInputChange={handleChange}
			options={searchData}
			loading={loading}
			size="small"
			id="searchBar"
			loadingText={
				<div style={{ textAlign: "center", position: "relative", zIndex: "10000" }}>
					<CircularProgress style={{ color: "#a69eac", width: "25px", height: "25px" }} />
				</div>
			}
			sx={{
				width: 300,
				position: "relative",
				zIndex: "500000 !important",
				"&:hover fieldset": {
					borderColor: "#e1e1e1 !important",
				},
				"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
					border: "1px solid #e1e1e1 !important",
					boxShadow: "rgb(4 17 29 /25%) 0px 0px 8px 0px",
				},
				"& fieldset": {
					borderRadius: "10px",
				},
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					placeholder="Find nft by name"
					InputProps={{
						...params.InputProps,
						startAdornment: <SearchIcon sx={{ color: "#a69eac" }} />,
					}}
				/>
			)}
			getOptionLabel={(option) => {
				return option.title || ""
			}}
			renderOption={(props, option) => (
				<div onClick={handleClick}>
					<Link key={option.nftData[0]._id} href={`/nft/${option.nftData[0]._id}`}>
						<Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
							<img loading="lazy" width="20" src={option.imageUrl} alt={option.title} />
							{option.title}
						</Box>
					</Link>
				</div>
			)}
		/>
	)
}
export default SearchBar
