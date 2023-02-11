import { View, Image, StyleSheet } from 'react-native';
import React from "react";
import { Button, Text, Card } from 'react-native-paper';

export type Props = {
    id: string;
    title: string;
    image: string;
    navigation: any;
};

export default function Movie(props: Props) {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Card.Cover style={styles.cover} source={{ uri: props.image }} />
                <Text style={styles.title} variant="titleLarge">{props.title}</Text>
                <Button
                    mode="elevated"
                    onPress={() => props.navigation.navigate('Details', { id: props.id})}
                >Details</Button>
            </Card.Content>
        </Card>
    );
}
const styles = StyleSheet.create({
    card: {
        margin: 10,
        width: 300
    },
    title: {
        textAlign: "center",
        margin: 10
    },
    cover: {
        height: 350
    }
});


