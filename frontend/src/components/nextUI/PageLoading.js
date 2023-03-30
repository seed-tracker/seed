import { Container, Loading, Text } from "@nextui-org/react";

const PageLoading = ({ text }) => {
  return (
    <Container fluid justify="center" align="center" css={{ padding: "10rem" }}>
      <Loading size="xl" aria-label="Page loading" />
      <Text>{text}</Text>
    </Container>
  );
};

export default PageLoading;
