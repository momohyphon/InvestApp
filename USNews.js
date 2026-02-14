import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';

const USNews = ({ data, rsData }) => {
  const highRsStocks = rsData?.rankings
    ?.filter(stock => stock.rs_avg >= 60)
    .map(stock => String(stock.code).toUpperCase().trim()) || [];

  const stockKeys = Object.keys(data || {})
    .filter(key => {
      if (!key.includes('_') || key === 'update_time' || key === 'sort_standard') return false;
      
      // AAPL_Apple Inc. → AAPL 추출
      const stockCode = key.split('_')[0].toUpperCase().trim();
      
      // 대소문자 무시하고 비교
      const matches = highRsStocks.some(rsCode => 
        rsCode.toUpperCase() === stockCode?.toUpperCase()
      );
      
      return matches;
    })
    .sort((a, b) => {
      const nameA = a.split('_')[0]?.toUpperCase() || '';
      const nameB = b.split('_')[0]?.toUpperCase() || '';
      return nameA.localeCompare(nameB);
    });

  const [selectedStock, setSelectedStock] = useState(null);

  if (!selectedStock) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.headerTitle}>Heating Company News</Text>
        
        {stockKeys.map((key, index) => (
          <View key={key}>
            <Pressable
              style={styles.stockItem}
              onPress={() => setSelectedStock(key)}
            >
              {({ pressed }) => (
                <>
                  <Text style={[styles.stockName, pressed && styles.stockNamePressed]}>
                    {key.split('_')[0]}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </Pressable>
            {index < stockKeys.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </ScrollView>
    );
  }

  const newsArticles = (data[selectedStock]?.articles || []).slice(0, 20);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Pressable 
        style={styles.backButton}
        onPress={() => setSelectedStock(null)}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      
      <Text style={styles.newsHeader}>{selectedStock.split('_')[0]} News</Text>
      
      {newsArticles.map((art, idx) => (
        <View key={idx}>
          <Pressable
            style={styles.newsItem}
            onPress={() => art.link && Linking.openURL(art.link)}
          >
            {({ pressed }) => (
              <>
                <Text style={[styles.newsTitle, pressed && styles.newsTitlePressed]} numberOfLines={2}>
                  {art.title}
                </Text>
                <View style={styles.newsMeta}>
                  <Text style={styles.publisher}>{art.publisher}</Text>
                  <Text style={styles.time}> · {art.time}</Text>
                </View>
              </>
            )}
          </Pressable>
          {idx < newsArticles.length - 1 && (
            <View style={styles.divider} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6800',
    marginBottom: 20,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  stockName: {
    color: '#fff',
    fontSize: 15,
  },
  stockNamePressed: {
    color: '#FF6800',
  },
  arrow: {
    color: '#999',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: '#999',
    fontSize: 14,
  },
  newsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6800',
    marginBottom: 15,
  },
  newsItem: {
    paddingVertical: 15,
  },
  newsTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  newsTitlePressed: {
    color: '#FF6800',
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publisher: {
    color: '#999',
    fontSize: 12,
  },
  time: {
    color: '#666',
    fontSize: 12,
  },
});

export default USNews;