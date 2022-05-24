import { useState, useCallback } from 'react';
import { Box, Button, Center, Flex, Heading, Input, Link, Text, VStack } from '@chakra-ui/react';

type TeamInfo = {
  name:string,
  website:string,
  address:string,
  id:number,
  stats: any
}
function App() {
  const [allTeams, setAllTeams] = useState<Array<TeamInfo>>([]);
  const [showInfos,setShowInfos] = useState<any>({});
  
  const handleChange = useCallback(async (event:any) => {
    try{
    const response = await fetch(`http://localhost:9090/teamInfo?team=${event}`);
    const infos = await response.json();
    setAllTeams(infos);
   
    setShowInfos(allTeams.reduce((accumulator:any,current:any)=>{
      accumulator[current.id] = false;
      return accumulator;
      },{}));
      console.log(showInfos);
    } catch(error){
      console.log(error)
  }
  }, [allTeams, showInfos]);
  const showStats = useCallback(async (id:number) => {
    
    setShowInfos((prev:any)=>{
      return {...prev, [id]:!prev[id]}
    })
   
    if(!allTeams.find(team => team.id === id)?.stats && !showInfos?.id){
    try{
      const response = await fetch(`http://localhost:9090/statistics?team=${id}`);
      const stats = await response.json();
      setAllTeams(Teams =>
        Teams.map(team => 
        team.id === id ? {...team, stats} : team
    )
      );
      } catch(error){
        console.log(error)
    }
    }
  }, [allTeams, showInfos]);




  return (
    <Box mt={"40px"}>
      
      <Input color="white"   maxW="50%" textAlign="center" left="20%" mt="20px" mb="20px" placeholder='Search your team'  _placeholder={{ opacity: 1, color: 'white' }} onChange={(e) => handleChange(e.target.value)} />
      <Flex flexWrap="wrap" ml={"50px"}>
    {allTeams && allTeams.length && allTeams.map(team => (
    <Box
    border="1px solid black"
    mr={"20px"}
    mb={"20px"}
    maxW={'445px'}
    w={'full'}
    boxShadow={'2xl'}
    rounded={'md'}
    p={6}
    key={team.id}
    overflow={'hidden'}>   
        <VStack>
          <Heading color="white"  as='h1' size='xl' fontWeight='semibold'>{team.name}</Heading>
        <Heading color="white" size="sm">Main Address</Heading>
        <Text
        color="white"
          fontWeight={800}
          fontSize={'sm'}
          letterSpacing={1.1}>
          {team.address}
        </Text>
        <Heading color="white" size="sm">Website</Heading>
        <Link color='blue.500' href={team.website} isExternal>{team.website}</Link>
          </VStack>
          <Center>
          <Button onClick={() => showStats(team.id)} colorScheme="blue">Show Details {team.id}</Button>
          </Center>
      
          { showInfos[team.id] && team.stats && 
          <Box textAlign="center">
          <Heading color="white" as='h2' size='lg' fontWeight='semibold' mb={4}> Team Details</Heading>
           <Text color="white">Number of matches won at home: {team.stats.win.home}</Text>
            <Text color="white">Number of matches lost at home: {team.stats.lost.home}</Text>
            <Text color="white">Number of matches won  away: {team.stats.win.away}</Text>
            <Text color="white">Number of matches lost away: {team.stats.lost.away}</Text>
            <Text color="white">Average Goals: {team.stats.averageGoals}</Text>
            </Box>
          }
        </Box>
    ))}
    </Flex>
    </Box>
  );
}


export default App;
