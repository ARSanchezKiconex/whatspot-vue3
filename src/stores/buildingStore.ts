import { defineStore } from 'pinia'
import { Building, Room } from '../types'

interface BuildingState {
  buildings: Building[]
}

export const useBuildingStore = defineStore('building', {
  state: (): BuildingState => ({
    buildings: [
      {
        id: '1',
        name: 'Main Building',
        description: 'Our primary office building with modern facilities',
        image: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg',
        rooms: [
          {
            id: '1',
            buildingId: '1',
            name: 'Conference Room A',
            capacity: 20,
            description: 'Large conference room with video conferencing equipment',
            features: ['Projector', 'Video Conference', 'Whiteboard'],
            image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
          },
          {
            id: '2',
            buildingId: '1',
            name: 'Meeting Room 1',
            capacity: 8,
            description: 'Small meeting room for team discussions',
            features: ['TV Screen', 'Whiteboard'],
            image: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg'
          }
        ]
      },
      {
        id: '2',
        name: 'Innovation Center',
        description: 'Modern space for creative work and collaboration',
        image: 'https://images.pexels.com/photos/1743555/pexels-photo-1743555.jpeg',
        rooms: [
          {
            id: '3',
            buildingId: '2',
            name: 'Creative Studio',
            capacity: 15,
            description: 'Open space for creative workshops and brainstorming',
            features: ['Standing Desks', 'Design Materials', 'Smart Board'],
            image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg'
          },
          {
            id: '4',
            buildingId: '2',
            name: 'Quiet Room',
            capacity: 4,
            description: 'Small room for focused work or private meetings',
            features: ['Sound Proofing', 'Comfortable Seating'],
            image: 'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg'
          }
        ]
      }
    ]
  }),

  getters: {
    getBuildingById: (state) => (id: string) => {
      return state.buildings.find(b => b.id === id)
    },

    getRoomById: (state) => (buildingId: string, roomId: string) => {
      const building = state.buildings.find(b => b.id === buildingId)
      return building?.rooms.find(r => r.id === roomId)
    },

    getAllRooms: (state) => {
      return state.buildings.flatMap(b => b.rooms)
    }
  }
})