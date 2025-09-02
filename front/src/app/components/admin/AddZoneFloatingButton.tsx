// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Button,
//   IconButton,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Input,
//   Select,
//   useToast,
//   FormControl,
//   FormLabel,
//   VStack,
// } from "@chakra-ui/react";
// import { AddIcon } from "@chakra-ui/icons";

// type Props = {
//   user: string;
// };

// const AddZoneFloatingButton = ({ user }: Props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [space, setSpace] = useState("");
//   const [kc, setKc] = useState("");
//   const [soilType, setSoilType] = useState("loamy");
//   const [criticalMoisture, setCriticalMoisture] = useState("");
//   const [flow_rate, setFlow_rate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();
//   const router = useRouter();

//   const handleCreateZone = async () => {
//     if (!name || !space || !kc || !criticalMoisture) {
//       toast({
//         title: "Tous les champs sont requis.",
//         status: "warning",
//         isClosable: true,
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/zones/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           space: parseFloat(space),
//           kc: parseFloat(kc),
//           soil_type: soilType,
//           critical_moisture_threshold: parseFloat(criticalMoisture),
//           user : user, // assuming your backend uses this to assign the zone
//         }),
//       });

//       if (!response.ok) throw new Error("Erreur lors de la création");

//       toast({
//         title: "Zone créée avec succès.",
//         status: "success",
//         isClosable: true,
//       });

//       setIsOpen(false);
//       router.refresh(); // or router.push('/zones') if you want to go to a zones page
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de créer la zone.",
//         status: "error",
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <IconButton
//         aria-label="Add Zone"
//         icon={<AddIcon />}
//         position="fixed"
//         bottom="20px"
//         right="20px"
//         borderRadius="50%"
//         size="lg"
//         colorScheme="blue"
//         onClick={() => setIsOpen(true)}
//       />

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Créer une nouvelle zone</ModalHeader>
//           <ModalBody>
//             <VStack spacing={4}>
//               <FormControl>
//                 <FormLabel>Nom de la zone</FormLabel>
//                 <Input value={name} onChange={(e) => setName(e.target.value)} />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Superficie (m²)</FormLabel>
//                 <Input
//                   type="number"
//                   value={space}
//                   onChange={(e) => setSpace(e.target.value)}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Coefficient de culture (kc)</FormLabel>
//                 <Input
//                   type="number"
//                   value={kc}
//                   onChange={(e) => setKc(e.target.value)}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Type de sol</FormLabel>
//                 <Select
//                   value={soilType}
//                   onChange={(e) => setSoilType(e.target.value)}
//                 >
//                   <option value="clay">Argil++++++++eux</option>
//                   <option value="loamy">Limonneux</option>
//                   <option value="sandy">Sableux</option>
//                   <option value="others">Autres</option>
//                 </Select>
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Seuil d'humidité critique (%)</FormLabel>
//                 <Input
//                   type="number"
//                   value={criticalMoisture}
//                   onChange={(e) => setCriticalMoisture(e.target.value)}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel>Débit d'aeau (L/s)</FormLabel>
//                 <Input
//                   type="number"
//                   value={flow_rate}
//                   onChange={(e) => setFlow_rate(e.target.value)}
//                 />
//               </FormControl>
//             </VStack>
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               colorScheme="blue"
//               onClick={handleCreateZone}
//               mr={3}
//               isLoading={loading}
//             >
//               Créer
//             </Button>
//             <Button variant="ghost" onClick={() => setIsOpen(false)}>
//               Annuler
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default AddZoneFloatingButton;
