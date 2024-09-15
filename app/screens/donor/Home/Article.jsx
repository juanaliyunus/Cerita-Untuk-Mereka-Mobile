import { XIcon } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const Article = () => {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const scrollViewRef = useRef(null);

  const articles = [
    {
      title: "Reading Changes Lives",
      imageUri: "https://assets.kompasiana.com/items/album/2021/02/20/whatsapp-image-2021-02-20-at-16-11-35-6030e8ccd541df63854638a2.jpeg?t=o&v=770",
      content: "Books have the power to change lives by opening up new worlds and perspectives. When children have access to books, they gain knowledge and insight that can profoundly impact their futures. This article explores how reading can transform lives, providing opportunities for growth, learning, and understanding."
    },
    {
      title: "Library in Your Pocket",
      imageUri: "https://asset-2.tstatic.net/banjarmasin/foto/bank/images/anak-panti-asuhan-saat-mengunjungi-perpustaan_20171220_204351.jpg",
      content: "In the digital age, having access to a library in your pocket is a revolutionary concept. Mobile libraries and e-books allow readers to access a vast array of books anytime and anywhere. This article discusses the advantages of digital libraries, including convenience, accessibility, and the ability to carry multiple books without physical constraints."
    },
    {
      title: "Books Build Brains",
      imageUri: "https://images.autofun.co.id/file1/712c7962a4fc4c648fe8e26b2826de1c_1200.jpg",
      content: "Research has shown that reading regularly can improve cognitive development, enhance vocabulary, and increase empathy. Books stimulate the brain, encourage critical thinking, and provide mental exercises that contribute to overall cognitive health. This article delves into the science behind how books build brains and why reading is essential for intellectual growth."
    },
  ];

  const openModal = (index) => {
    setSelectedArticleIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedArticleIndex(null);
  };


  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.floor(contentOffsetX / (width-32));
    console.log(contentOffsetX);
    console.log(width);
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const selectedArticle = selectedArticleIndex !== null ? articles[selectedArticleIndex] : {};

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {articles.map((article, index) => (
          <View key={index} style={{width:400 }} className="bg-[#E0F7FA] p-4 shadow-md relative mb-4">
            <Image
              source={{ uri: article.imageUri }}
              className="w-full h-48 rounded-lg"
            />
<View className="absolute top-6 left-6">
  <Text 
    className="text-white text-xl font-bold"
    style={{
      textShadowColor: 'black',
      textShadowOffset: { width: -1, height: 2 },
      textShadowRadius: 1
    }}
  >
    {article.title}
  </Text>
</View>

            <View className="absolute bottom-7 left-6">
              <TouchableOpacity
                className="bg-white/70 rounded-full py-2 px-4"
                onPress={() => openModal(index)}
              >
                <Text className="text-black text-center font-bold">Read more</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

     
      <View className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex-row justify-center">
        {articles.map((_, index) => (
            <View
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${currentPage === index? 'bg-blue-500' : 'bg-gray-300'}`}
            />
        ))}
     </View>


      {selectedArticleIndex !== null && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-11/12 max-w-md bg-[#E0F7FA] rounded-2xl shadow-xl overflow-hidden">
              <View className="px-6 py-4 bg-[#E0F7FA] flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-800">{selectedArticle.title}</Text>
                <TouchableOpacity onPress={closeModal} className="p-2">
                  <XIcon size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <ScrollView className="px-6 py-4 max-h-96">
                <Text className="text-base text-gray-600 leading-relaxed">
                  {selectedArticle.content}
                </Text>
              </ScrollView>
              <View className="px-6 py-4 border-t border-gray-200">
                <TouchableOpacity 
                  onPress={closeModal}
                  className="w-full bg-blue-500 py-3 rounded-lg"
                >
                  <Text className="text-center text-white font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Article;
