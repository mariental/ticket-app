import { configureFonts, MD3DarkTheme} from "react-native-paper";
import { DarkTheme } from "@react-navigation/native";
import merge from "deepmerge";

const fontConfig = {
    fontFamily: 'sans-serif',
};

export const navTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: "rgb(0, 98, 161)",
        background: "rgb(226, 226, 230)",
        card: 'rgb(26, 28, 30)',
        text: 'rgb(226, 226, 230)',
        notification: 'rgb(226, 226, 230)'
    }
};

export const appTheme = {
    ...MD3DarkTheme,
    roundness: 3,
    fonts: configureFonts({config: fontConfig}),
    "colors": {
        "primary": "rgb(156, 202, 255)",
        "onPrimary": "rgb(0, 50, 87)",
        "primaryContainer": "rgb(0, 73, 123)",
        "onPrimaryContainer": "rgb(208, 228, 255)",
        "secondary": "rgb(186, 200, 219)",
        "onSecondary": "rgb(37, 49, 64)",
        "secondaryContainer": "rgb(59, 72, 87)",
        "onSecondaryContainer": "rgb(214, 228, 247)",
        "tertiary": "rgb(214, 190, 229)",
        "onTertiary": "rgb(58, 41, 72)",
        "tertiaryContainer": "rgb(82, 64, 96)",
        "onTertiaryContainer": "rgb(241, 218, 255)",
        "error": "rgb(255, 180, 171)",
        "onError": "rgb(105, 0, 5)",
        "errorContainer": "rgb(147, 0, 10)",
        "onErrorContainer": "rgb(255, 180, 171)",
        "background": "rgb(26, 28, 30)",
        "onBackground": "rgb(226, 226, 230)",
        "surface": "rgb(26, 28, 30)",
        "onSurface": "rgb(226, 226, 230)",
        "surfaceVariant": "rgb(66, 71, 78)",
        "onSurfaceVariant": "rgb(194, 199, 207)",
        "outline": "rgb(140, 145, 153)",
        "outlineVariant": "rgb(66, 71, 78)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(226, 226, 230)",
        "inverseOnSurface": "rgb(47, 48, 51)",
        "inversePrimary": "rgb(0, 98, 161)",
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(33, 37, 41)",
            "level2": "rgb(36, 42, 48)",
            "level3": "rgb(40, 47, 55)",
            "level4": "rgb(42, 49, 57)",
            "level5": "rgb(44, 52, 62)"
        },
        "surfaceDisabled": "rgba(226, 226, 230, 0.12)",
        "onSurfaceDisabled": "rgba(226, 226, 230, 0.38)",
        "backdrop": "rgba(44, 49, 55, 0.4)"
    }
};
