import { useEffect, useState } from "react";
import { Container, VStack, Box, Text, Link, Heading, Spinner, Flex } from "@chakra-ui/react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10Ids = storyIds.slice(0, 10);

        const storyPromises = top10Ids.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top stories:", error);
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <Container maxW="container.lg" p={4}>
      <Box as="nav" bg="gray.800" color="white" p={4} mb={6}>
        <Heading size="lg">Hacker News</Heading>
      </Box>
      {loading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <Link href={story.url} isExternal>
                <Heading size="md" mb={2}>{story.title}</Heading>
              </Link>
              <Text>By: {story.by}</Text>
              <Text>Comments: {story.descendants}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;