import { View, Text, ImageBackground } from 'react-native';
import styles from './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadFonts } from '../../assets/fonts/fonts';
import { useState, useEffect } from 'react';
import Trip from '../../components/trip/trip';
import BottomToolbar from '../../components/bottom-toolbar/bottom-toolbar';
import { ScrollView } from 'react-native-gesture-handler';
import { setFavorites } from '../../reducers/user';
import { serverURL } from '../../api/backend_request';

export default function Discover({ navigation }) {
  const dispatch = useDispatch();
  //STATE TO STORE ALL THE TRIPS TO DISPLAY
  const [tripsData, setTripsData] = useState([]);
  const favorites = useSelector((state) => state.user.favorites);
  const TOKEN = useSelector((state) => state.user.value.token);
  //GET ALL THE TRIPS WHEN LOADING THE SCREEN + FAVORITES OF THE USER TO SAVE IN THE REDUCER
  useEffect(() => {
    //GET ALL THE TRIPS
    fetch(`${serverURL}/trips`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTripsData(data.trips);
        } else {
          console.log('Fetch of trips failed on Discover.');
        }
      });

    //SAVE ALL THE FAVORITES IN THE REDUCER
    fetch(`${serverURL}/users/idLike/${TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data.tripsLiked);
          console.log('reducer initialized successfully');
          dispatch(setFavorites(data.tripsLiked));
        } else {
          console.log('reducer failed on initialisation');
        }
      });
  }, []);

  //MAKE SURE THE FONTS ARE LOADED
  const loadedFonts = loadFonts();
  if (!loadedFonts) return <></>;

  //MAP TO DISPLAY ALL THE TRIPS
  const trips = tripsData.map((data, i) => {
    //convert number into month's names
    return (
      <Trip
        key={i}
        containerStyles={styles.tripCardContainer}
        topElementsContainerStyles={styles.tripCardTopElementsContainer}
        countryStyles={styles.tripCardCountry}
        heartStyles={styles.tripCardheart}
        titleStyles={styles.tripCardTitle}
        dateStyles={styles.tripCardDate}
        priceStyles={styles.tripCardPrice}
        id={data._id}
        {...data}
        isFavorite={favorites.some((favorite) => favorite === data._id)}
      />
    );
  });

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.text}>Choose your next adventure.</Text>
          <View style={styles.border}></View>
        </View>
        <Highlight />
        <Text style={styles.tripsHeader}>Our recommendations</Text>
        <View style={styles.tripsContainer}>{trips}</View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <BottomToolbar />
    </>
  );
}

function Highlight() {
  return (
    <View style={styles.highlightContainer}>
      <Text style={styles.highlightHeader}>Highlight</Text>
      <View style={styles.highlightWrapper}>
        <ImageBackground
          imageStyle={{ borderRadius: 15 }}
          style={styles.highlightImg}
          source={{
            uri: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80',
          }}
        >
          <View style={styles.imageLayer}></View>
        </ImageBackground>
        <View style={styles.highlightInfoContainer}>
          <Text style={styles.highlightTitle}>Norway fjords and northern lights</Text>
          <Text style={styles.highlightDates}>20 jan. - 28 feb. 2023</Text>
          <Text style={styles.highlightDescription}>
            We have spent decades in search for the most beautiful spots in the north,
            come join us! We bring you to the right spot at the right time. Come chase the
            northern lights with us.
          </Text>
        </View>
      </View>
    </View>
  );
}
