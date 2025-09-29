// FILE: src/components/CategoryCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Category} from '../../types/menu';
import {THEME} from '../../screens/theme';

interface CategoryCardProps {
  item: Category;
  onEdit: (item: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>
            {item.icon} {item.name}
          </Text>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
      <View style={styles.cardActions}>
        {!item?.isSystemCategory && (
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Icon name="delete-outline" size={24} color={THEME.VIBRANT_RED} />
          </TouchableOpacity>
        )}
        {!item?.isSystemCategory && (
          <TouchableOpacity
            onPress={() => onEdit(item)}
            style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#B0B0B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.DARK_CHARCOAL,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: THEME.MEDIUM_GRAY,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    minHeight: 60,
  },
  editButton: {
    backgroundColor: `${THEME.VIBRANT_RED}20`,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  editButtonText: {
    color: THEME.VIBRANT_RED,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
