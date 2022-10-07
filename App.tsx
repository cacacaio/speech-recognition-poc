import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Voice, { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice'
import Animated, { ColorSpace, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { Dimensions, ColorValue } from 'react-native';
import { getRandomProperty } from './util'
import { Ionicons } from '@expo/vector-icons';
import CommandsModal from './CommandsModal';

const { width, height } = Dimensions.get('window');

const SQUARE_SIZE = 100;
const CONTAINER_HEIGHT = 500;

const COLORS = {
  roxo: '#7C57BE',
  rosa: '#FF007C',
  preto: '#000000',
  azul: '#0A84FF',
  verde: '#2BEE66',
  amarelo: '#FFD60A',
  vermelho: '#FF453A',
} as const

const FOTOS = {
  'carlos': 'https://cdn.discordapp.com/avatars/796890301809164319/be33d117bb39357d4e1817a0e319ffdc.png?size=1024',
  'luan': 'https://cdn.discordapp.com/avatars/719390553829015593/2d2984006b72f935237c3bfd8f7fb175.png?size=1024',
  'pietra': 'https://cdn.discordapp.com/avatars/239522321063215105/b270839175f2e3383020aff16d6a3099.png?size=1024',
  'luciano': 'https://cdn.discordapp.com/avatars/387311552438599682/cc43e3bc44dd23b684e3009d390aa2f9.png?size=1024',
  'canguru': 'https://i.imgur.com/dfHpFMY.png',
  'zé': 'https://cdn.discordapp.com/avatars/522619098933362698/8d27f620d73f7d0601830500d35bb153.png?size=1024',
} as const;

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);
  const zRotation = useSharedValue(0);
  const xRotation = useSharedValue(0);
  const yRotation = useSharedValue(0);
  const backgroundColor = useSharedValue<ColorValue>('#FF0000');
  const size = useSharedValue(SQUARE_SIZE);
  const borderRadius = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [currentImage, setCurrentImage] = useState('https://cdn.discordapp.com/avatars/719390553829015593/2d2984006b72f935237c3bfd8f7fb175.png?size=1024');

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: backgroundColor.value,
      transform: [{ translateX: xPosition.value }, { translateY: yPosition.value }, { rotateZ: `${zRotation.value}deg` }, {
        rotateX: `${xRotation.value}deg`
      }, { rotateY: `${yRotation.value}deg` }],
      width: size.value,
      height: size.value,
      borderRadius: borderRadius.value,
    }),
    [backgroundColor]
  );

  const imageAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    })
  );

  const findInArray = (array: string[]) => (query: string) => {
    const values = (array ?? []).map((val) => String(val).toLowerCase());
    const found = values.find((item) => item.includes(query));
    return found
  }

  const handleChangeImage = (image: string) => {
    setTimeout(() => {
      setCurrentImage(image)
    }, 500)
    opacity.value = withSequence(
      withTiming(0, { duration: 500 }),
      withTiming(1, { duration: 500 }),
    )
  }

  const onResults = (results: SpeechResultsEvent) => {
    const find = findInArray(results.value ?? []);
    const MAX_BOTTOM = CONTAINER_HEIGHT - size.value;
    const MAX_RIGHT = width - size.value;

    const colorFound = find('roxo') || find('rosa') || find('preto') || find('azul') || find('verde') || find('amarelo') || find('vermelho');
    if (colorFound) {
      const colors = Object.keys(COLORS) as (keyof typeof COLORS)[];
      const colorKey = colors.find((color) => colorFound.includes(color)) ?? 'vermelho';
      backgroundColor.value = withTiming(COLORS[colorKey], { duration: 1000 });
    }
    if (find('direita')) {
      xPosition.value = withTiming(MAX_RIGHT, { duration: 1000 });
    }
    if (find('esquerda')) {
      xPosition.value = withTiming(0, { duration: 1000 });
    }
    if (find('baixo') || find('baixa')) {
      yPosition.value = withTiming(MAX_BOTTOM, { duration: 1000 });
    }
    if (find('cima')) {
      yPosition.value = withTiming(0, { duration: 1000 });
    }
    if (find('centro')) {
      xPosition.value = withTiming(MAX_RIGHT / 2, { duration: 1000 });
      yPosition.value = withTiming(MAX_BOTTOM / 2, { duration: 1000 });
    }
    if (find('rodar')) {
      zRotation.value = withTiming(zRotation.value + 360, { duration: 1000 });
    }
    if (find('girar') && find('x')) {
      xRotation.value = withTiming(xRotation.value + 180, { duration: 1000 });
      const randomColor = getRandomProperty(COLORS);
      backgroundColor.value = withDelay(500, withTiming(COLORS[randomColor], { duration: 500 }))
    }
    if (find('girar') && find('y')) {
      yRotation.value = withTiming(yRotation.value + 180, { duration: 1000 });
    }

    if (find('aumentar')) {
      const aumentar = find('aumentar')?.split('aumentar')[1];
      console.log('🚀 ~ file: App.tsx ~ line 113 ~ aumentar', aumentar)
      const multiply = Number(aumentar) || 1;
      console.log('🚀 ~ file: App.tsx ~ line 115 ~ multiply', multiply)
      const isRight = xPosition.value === MAX_RIGHT
      const isBottom = yPosition.value === MAX_BOTTOM
      withSequence(
        size.value = withTiming(size.value + 50 * multiply, { duration: 1000 }),
        xPosition.value = withTiming(isRight ? MAX_RIGHT - 50 : xPosition.value, { duration: 1000 }),
        yPosition.value = withTiming(isBottom ? MAX_BOTTOM - 50 : yPosition.value, { duration: 1000 }),
      )
    }
    if (find('diminuir')) {
      size.value = withTiming(size.value - 50, { duration: 1000 });
    }
    if (find('mais bord') || find('mais redond')) {
      borderRadius.value = withTiming(borderRadius.value + 20, { duration: 1000 });
    }
    if (find('menos bord') || find('menos redond')) {
      borderRadius.value = withTiming(borderRadius.value - 20, { duration: 1000 });
    }
    if(find('circulo')){
      borderRadius.value = withTiming(size.value / 2, { duration: 1000 });
    }
    if(find('quadrado')){
      borderRadius.value = withTiming(0, { duration: 1000 });
    }
    if (find('resetar')) {
      xPosition.value = withTiming(0, { duration: 1000 });
      yPosition.value = withTiming(0, { duration: 1000 });
      zRotation.value = withTiming(0, { duration: 1000 });
      xRotation.value = withTiming(0, { duration: 1000 });
      yRotation.value = withTiming(0, { duration: 1000 });
      backgroundColor.value = withTiming('#FF0000', { duration: 1000 });
      size.value = withTiming(SQUARE_SIZE, { duration: 1000 });
      borderRadius.value = withTiming(0, { duration: 1000 });
      opacity.value = withTiming(0, { duration: 1000 });
    }
    Object.entries(FOTOS).forEach(
      ([key, value]) => {
        if (find(key)) {
          handleChangeImage(value)
        }
      }
    )
    setResults(results.value ?? []);
    setListening(false);
  }

  const onSpeechStart = () => {
    console.log('🚀 ~ Speech Started')
  }

  const onSpeechEnd = () => {
    console.log('🚀 ~ Speech Ended')
    setListening(false);
    Voice.stop();
  }

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
  }, []);

  const startVoice = async () => {
    try {
      if (listening) {
        setListening(false);
        return Voice.stop();
      }
      Voice.removeAllListeners();
      Voice.onSpeechResults = onResults;
      await Voice.start('pt-BR');
      setListening(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.squareContainer}>
          <Animated.View style={[animatedStyle]} />
          <Animated.Image style={[animatedStyle, imageAnimatedStyle, { position: 'absolute' }]} resizeMode='contain' source={{ uri: currentImage }} />
        </View>
        <StatusBar style="auto" />
        {/* <Button onPress={startVoice} title={!listening ? 'Começar Voice' : 'Parar Voice'} /> */}
        <View style={styles.row}>
          <TouchableOpacity onPress={startVoice}>
            <Ionicons name="mic" size={60} style={{
              marginTop: 10,
            }} color={listening ? 'red' : "white"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalOpen(true);
            }}
            style={{
              right: width * 0.1,
              position: 'absolute',
            }}>
            <Ionicons name='book' size={30} color='white' style={{ marginTop: 10 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.resultsContainer}>
          <Text style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
          }}>Resultados</Text>
          {results.map((r: string) => <Text key={r} style={{
            color: 'white',
            textAlign: 'center'
          }}>{r}</Text>)}
        </View>
      </View>
      <CommandsModal visible={isModalOpen} setVisible={setIsModalOpen} /></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareContainer: {
    height: CONTAINER_HEIGHT,
    width: '100%',
    backgroundColor: '#424242',
  },
  resultsContainer: {
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center'
  }
});
