import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "styled-components";
import * as Yup from "yup";

import { BackButton } from "../../../components/BackButton";
import { RootStackParamList } from "../../../routes/types.routes";
import { api } from "../../../services/api";

import {
  ConfirmPasswordInput,
  Container,
  FinishRegisterButton,
  Form,
  FormTitle,
  Header,
  PasswordInput,
  ScrollableContainer,
  SignUpFirstStep,
  SignUpSecondStep,
  SignUpSteps,
  SubTitle,
  Title,
} from "./styles";

export function SecondStep() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { user } = route.params as RootStackParamList["SignUpSecondStep"];

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  async function handleFinishRegister() {
    try {
      const schema = Yup.object().shape({
        password: Yup.string().required("Senha é obrigatória"),
        passwordConfirmation: Yup.string()
          .required("Confirmação de senha é obrigatória")
          .equals(
            [Yup.ref("password")],
            "A confirmação de senha precisa ser igual à senha"
          ),
      });

      const data = { password, passwordConfirmation };
      await schema.validate(data, { abortEarly: false });

      await api
        .post("/users", {
          name: user.name,
          email: user.email,
          driver_license: user.driverLicense,
          password,
        })
        .then(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "Confirmation",
                  params: {
                    title: "Conta criada!",
                    screenToNavigate: "SignIn",
                    message: `Agora é só fazer login\ne aproveitar.`,
                  },
                },
              ],
            })
          );
        })
        .catch((error) => {
          Alert.alert(
            "Erro no cadastro",
            "Ocorreu um erro ao fazer o cadastro, verifique as credenciais."
          );
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return Alert.alert("Opa", error.errors.join("\n"));
      }
    }
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack} />

        <SignUpSteps>
          <SignUpFirstStep />
          <SignUpSecondStep active />
        </SignUpSteps>
      </Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollableContainer
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Title>
            Crie sua{"\n"}
            conta
          </Title>
          <SubTitle>
            Faça seu cadastro de{"\n"}
            forma rápida e fácil
          </SubTitle>

          <Form>
            <FormTitle>Sua senha</FormTitle>

            <PasswordInput
              placeholder="Senha"
              autoCorrect={false}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            <ConfirmPasswordInput
              placeholder="Repetir Senha"
              autoCorrect={false}
              autoCapitalize="none"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
          </Form>

          <FinishRegisterButton
            title="Cadastrar"
            color={theme.colors.success}
            onPress={handleFinishRegister}
          />
        </ScrollableContainer>
      </KeyboardAvoidingView>
    </Container>
  );
}
