import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';

const GlobalFinance = ({ data }) => {
  if (!data || !data.items) return null;
  const { bonds, items, update_time } = data;

  const renderVal = (val) => {
    const num = parseFloat(val);
    const isPlus = num >= 0;
    return (
      <Text style={[styles.changeText, { color: isPlus ? '#ff4d4d' : '#007aff' }]}>
        {isPlus ? `+${num.toFixed(2)}` : num.toFixed(2)}%
      </Text>
    );
  };

  const renderTile = (name, value, change, link) => (
    <TouchableOpacity 
      key={name} 
      style={styles.tile}
      onPress={() => link && Linking.openURL(link)}
    >
      <Text style={styles.tileName} numberOfLines={1}>{name}</Text>
      <Text style={styles.tileValue}>{value}</Text>
      {renderVal(change)}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* TREASURY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TREASURY</Text>
          {["2Y", "10Y", "30Y"].map((key) => 
            renderTile(
              `${key} BOND`,
              `${bonds?.[`${key}_val`]}%`,
              bonds?.[`${key}_chg`] || 0,
              bonds?.[`${key}_link`]
            )
          )}
        </View>

        {/* MARKET I */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARKET I</Text>
          {items.slice(0, 7).map((item) =>
            renderTile(item.name, item.price, item.change, item.Link)
          )}
        </View>

        {/* MARKET II */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARKET II</Text>
          {items.slice(7).map((item) =>
            renderTile(item.name, item.price, item.change, item.Link)
          )}
        </View>

        <Text style={styles.updateTime}>{update_time}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 15,
  },
  section: {
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b00',
    paddingLeft: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#ff6b00',
    fontWeight: '900',
    marginBottom: 15,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  tileName: {
    fontSize: 12,
    color: '#aaa',
    width: 100,
  },
  tileValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'right',
    marginRight: 10,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '800',
    width: 70,
    textAlign: 'right',
  },
  updateTime: {
    fontSize: 10,
    color: '#333',
    textAlign: 'right',
    marginTop: 15,
  },
});

export default GlobalFinance;
