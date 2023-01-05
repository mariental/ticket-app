import { Button, Text, View, Image } from 'react-native';
import React from "react";

export type Props = {
    title: string;
    image: string;
};

export default function Movie(props: Props) {
    return (
        <View>
            <Text>{props.title}</Text>
            <Image style={{
                height: 300,
                width: 200
            }} source={require('../assets/avatar.png')}/>
            <Button
                title="Details"
            />
        </View>
    );
}


