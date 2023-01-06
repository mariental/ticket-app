import { Button, Text, View, Image } from 'react-native';
import React from "react";

export type Props = {
    id: string;
    title: string;
    image: string;
    navigation: any;
};

export default function Movie(props: Props) {
    return (
        <View>
            <Text>{props.title}</Text>
            <Image style={{
                height: 300,
                width: 200
            }} source={{uri: props.image}}/>
            <Button
                title="Details"
                onPress={() => props.navigation.navigate('Details', { id: props.id})}
            />
        </View>
    );
}


