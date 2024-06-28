// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";

// import Animated from "react-native-reanimated";

// //using asycn storage (does not work with android properly: disk space is low)
// export const CachedImage = props => {
//   const [cachedSource, setCachedSource] = useState(null);
//   const { uri } = props;

//   useEffect(() => {
//     const getCachedImage = async () => {
//       try {
//         const cachedImageData = await AsyncStorage.getItem(uri);
//         if (cachedImageData) {
//           setCachedSource({ uri: cachedImageData });
//         } else {
//           const response = await fetch(uri);
//           const imageBlob = await response.blob();
//           const base64Data = await new Promise(resolve => {
//             const reader = new FileReader();
//             reader.readAsDataURL(imageBlob);
//             reader.onloadend = () => {
//               resolve(reader.result);
//             };
//           });
//           await AsyncStorage.setItem(uri, base64Data);
//           setCachedSource({ uri: base64Data });
//         }
//       } catch (error) {
//         console.error("Error caching image:", error);
//         try {
//           // Fallback to loading directly from URI:
//           setCachedSource({ uri });
//         } catch (error) {
//           console.error("Error loading image:", error);
//           // Handle further errors as needed (e.g., display a placeholder)
//         }
//       }
//     };

//     getCachedImage();
//   }, []);

//   return (
//     <Animated.Image
//       source={cachedSource}
//       {...props}
//     />
//   );
// };

import { Image } from "expo-image";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

export const CachedImage = props => {
  const { uri, style, ...rest } = props;

  return (
    <Animated.View>
      <Image
        source={{ uri }}
        style={style}
        {...rest}
      />
    </Animated.View>
  );
};
