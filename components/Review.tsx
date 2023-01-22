import {StyleSheet, View} from 'react-native';
import { Text, useTheme, Card, Avatar} from 'react-native-paper';
import React from "react";
import { ReviewType } from "../types";

export type PropsType = {
    review: ReviewType;
}

export default function Review(props: PropsType) {

    const theme = useTheme()
    const subtitle = 'Rate: ' + props.review.rate + '/10'

    return (
        <Card style={{ backgroundColor: theme.colors.secondaryContainer, borderRadius: 20, padding: 20, marginBottom: 20}}>
            <Card.Title
                title={props.review.user}
                subtitle={subtitle}
                left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
            <Card.Content>
                <Text variant="bodyMedium">{props.review.content}</Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
});
