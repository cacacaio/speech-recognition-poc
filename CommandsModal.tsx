import React from 'react'
import { View, Text, Modal, Button, StyleSheet } from 'react-native'

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const CommandsModal = ({visible, setVisible} : Props) => {
    return (
        <Modal transparent visible={visible}>
            <View style={styles.container}>
                <Text style={styles.bigText}>Comandos</Text>
                <Text style={styles.text}>Cores: roxo, rosa, preto, azul, verde, amarelo, vermelho</Text>
                <Text style={styles.text}>Imagens: carlos, luan, pietra, luciano, canguru, zé</Text>
                <Text style={styles.text}>Posição: cima, baixo, esquerda, direita, centro</Text>
                <Text style={styles.text}>Tamanho: aumentar, diminuir</Text>
                <Text style={styles.text}>Forma: quadrado, circulo</Text>
                <Text style={styles.text}>Rotação: girar x, girar y, rodar</Text>
                <Text style={styles.text}>Redondo: mais redondo, menos redondo</Text>
                <Text style={styles.text}>Voltar ao inicio: Resetar</Text>
            <Button title='Fechar' onPress={() => setVisible(false)}></Button>
            </View>
        </Modal> 
    )
}

export default CommandsModal

const styles = StyleSheet.create({
    container: {
        height: 650,
        width: width * 0.9,
        backgroundColor: '#313131',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height * 0.08,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    bigText: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#fff',
    }
})