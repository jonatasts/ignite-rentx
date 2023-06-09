import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Platform,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Yup from "yup";

import { RootStackParamList } from "../../routes/types.routes";

import { useAuth } from "../../hooks/auth";

import {
  KAV,
  ScrollableContainer,
  Header,
  Title,
  SubTitle,
  Footer,
  RegisterButton,
  LoginButton,
  Form,
  EmailInput,
  PasswordInput,
} from "./styles";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [exitApp, setExitApp] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const navigationState = useNavigationState((state) => state);

  const { signIn } = useAuth();

  const showToast = () => {
    ToastAndroid.show(
      "Pressione novamente para sair do App!",
      ToastAndroid.LONG
    );
  };

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("E-mail obrigatório")
          .email("Digite um e-mail válido"),
        password: Yup.string().required("Senha obrigatória"),
      });

      await schema.validate({ email, password }, { abortEarly: false });

      setLoading(true);
      await signIn({ email, password });
    } catch (error) {
      setLoading(false);

      if (error instanceof Yup.ValidationError) {
        return Alert.alert("Opa", error.errors.join("\n"));
      }

      return Alert.alert(
        "Erro na autenticação",
        "Ocorreu um erro ao fazer login, verifique as credenciais."
      );
    }
  }

  function handleRegister() {
    navigation.navigate("SignUpFirstStep");
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigationState.index === 0) {
        if (exitApp) {
          setExitApp(false);
          BackHandler.exitApp();
        } else {
          showToast();
          setExitApp(true);
        }
      } else {
        setExitApp(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }

      return true;
    });
  }, [navigationState, exitApp]);

  return (
    <KAV behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollableContainer
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        <Header>
          <Title>
            Estamos{"\n"}
            quase lá.
          </Title>

          <SubTitle>
            Faça seu login para começar{"\n"}
            uma experiência incrível.
          </SubTitle>
        </Header>

        <Form>
          <EmailInput
            iconName="mail"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            selectTextOnFocus
            value={email}
            onChangeText={setEmail}
          />

          <PasswordInput
            placeholder="Senha"
            autoCorrect={false}
            autoCapitalize="none"
            selectTextOnFocus
            value={password}
            onChangeText={setPassword}
          />
        </Form>

        <Footer>
          <LoginButton
            title="Login"
            onPress={handleSignIn}
            enabled={!!email && !!password}
            loading={loading}
          />

          <RegisterButton
            title="Criar conta gratuita"
            onPress={handleRegister}
          />
        </Footer>
      </ScrollableContainer>
    </KAV>
  );
}
