import { StyleSheet, View} from 'react-native';
import { Button, TextInput, Text, FAB } from 'react-native-paper';
import React from "react";
import {TextInputMask} from "react-native-masked-text";

export default function AddOpinion() {

    const [content, setContent] = React.useState<string>('')
    const [rate, setRate] = React.useState<string>('')


    return (
        <View >
            <TextInput
                label="Rate"
                mode="outlined"
                onChangeText={setRate}
                value={rate}
                render={props =>
                    <TextInputMask
                        {...props}
                        type={'custom'}
                        options={
                            {
                                mask: "9"
                            }
                        }
                    />
                }
            />
            <TextInput
                label="Opinion content"
                mode="outlined"
                onChangeText={setContent}
                value={content}
                multiline={true}
                numberOfLines={8}
            />
        </View>
    );
}

const styles = StyleSheet.create({

});
