import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
} from "react-native";

import axios from "axios";

export default function App() {
	const baseURL = "https://api.github.com";
	const perPage = 5;

	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(() => {
		loadApi();
	}, []);

	function loadApi() {
		if (loading) return;

		setLoading(true);
		/*
		const response = await axios.get(
			`${baseURL}/search/repositories?q=react&per_page=${perPage}&page=${page}`
		);

		setData([...data, ...response.data.items]);
		setPage(page + 1);
		setLoading(false);
		*/

		axios
			.get(
				`${baseURL}/search/repositories?q=react&per_page=${perPage}&page=${page}`
			)
			.then((response) => {
				setData([...data, ...response.data.items]);
				setPage(page + 1);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}

	return (
		<View style={styles.container}>
			<FlatList
				style={{ marginTop: 35 }}
				contentContainerStyle={{ marginHorizontal: 20 }}
				data={data}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => <ListItem data={item} key={item.id} />}
				onEndReached={loadApi}
				onEndReachedThreshold={0.1}
				ListFooterComponent={<FooterList load={loading} />}
			/>
		</View>
	);
}

type ListItemProps = {
	data: any;
};

function ListItem({ data }: ListItemProps) {
	return (
		<View style={styles.listItem}>
			<Text style={styles.listText}>{data.full_name}</Text>
		</View>
	);
}

type FooterListProps = {
	load: boolean;
};

function FooterList({ load }: FooterListProps) {
	if (!load) return null;

	return (
		<View style={styles.loading}>
			<ActivityIndicator size={25} color="#121212" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	listItem: {
		backgroundColor: "#121212",
		padding: 30,
		marginTop: 20,
		borderRadius: 10,
	},
	listText: {
		fontSize: 16,
		color: "#FFF",
	},
	loading: {
		padding: 10,
	},
});
