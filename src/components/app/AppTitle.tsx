import { Center, Image, Stack, Title } from "@mantine/core"
import logo from "../../assets/favicon.png"

const AppTitle = () => {
    return (
        <Center mt="sm" mx="lg">
            <Stack>
                <Title ta="center" order={4} mx="sm" h="sm">
                    Legends Z-A
                </Title>
                <Title ta="center" order={2} c="white" mx="sm">
                    Donut Calculator
                </Title>
            </Stack>
            <Center>
                <Image src={logo} w="64px" />
            </Center>
        </Center>
    )
}

export default AppTitle
