import { ContentType, Degree, EducationLevel, SchoolingYear, SchoolStream, Specialization, StudyYear } from "@prisma/client";
import {amber} from "../src/db/index.js"

async function seedUsers() {
    try {
      const existingUser = await amber.user.findMany();
          if (existingUser.length > 0) {
            console.error('DB is already seeded with users.');
            return;
          }
      const user1 = await amber.user.create({
        data: {
          name: 'John Doe',
          username: 'johndoe123',
          password: 'hashedpassword123',
          email: 'johndoe@example.com',
          educationLevel: EducationLevel.UNDERGRADUATE,
          degree: Degree.BTECH, // Example enum value
          studyYear: StudyYear.SECOND, // Example enum value
          specialization: Specialization.COMPUTER_SCIENCE, // Example enum value
          profilepicture: 'https://example.com/johndoe.jpg',
          refresh_token: 'some_refresh_token_here',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log('Created user: ', user1);


      const user2 = await amber.user.create({
        data: {
          name: 'Jane Smith',
          username: 'janesmith456',
          password: 'hashedpassword456',
          email: 'janesmith@example.com',
          educationLevel: EducationLevel.SCHOOL, 
          schoolingYear: SchoolingYear.ELEVENTH, 
          schoolStream: SchoolStream.SCIENCE, 
          profilepicture: 'https://example.com/janesmith.jpg',
          refresh_token: 'some_refresh_token_here',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    
      console.log('Created user: ', user2);
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }

async function seedInstructor() {
    try {
      const existingInstructor = await amber.instructor.findMany();
          if (existingInstructor.length > 0) {
            console.error('DB is already seeded with instructor.');
            return;
          }
      const instructor = await amber.instructor.create({
        data: {
          name          : "Harkirat Singh",
          username      :  "har20"     ,
          password      : "par20@sh" ,
          email         :  "harkirat@gmail.com"     ,    
          refresh_token : "1324aghhsdnafZDADf",
          profilepicture: "https://instructor.png",
          bio            : "afgdhjfklgsahfadaofha" ,      
          contactNumber  : "1234567890"       ,
          createdAt      : new Date(),
          updatedAt      : new Date(),   
          qualification  : {
            create:[
                {
                  title: "Ph.D. in Computer Science",
                  institution: "Massachusetts Institute of Technology",
                  year: 2015,
                },
                {
                  title: "Master of Arts in Psychology",
                  institution: "Stanford University",
                  year: 2018,
                },
                {
                  title: "Bachelor of Science in Mechanical Engineering",
                  institution: "University of California, Berkeley",
                  year: 2010,
                },
              ],
            },
          achievement    : {
            create: [
                {
                  title: "Best Teacher Award",
                  referencepic: "https://example.com/achievement-teacher-award.jpg",
                  year: 2020,
                },
                {
                  title: "Research Excellence Award",
                  referencepic: "https://example.com/achievement-research-award.jpg",
                  year: 2018,
                }
              ],
          }
        },
      });

    
      console.log('Created user: ', instructor);
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }

  async function seedCourse(){
        try{
          const existingCourses = await amber.course.findMany();
          if (existingCourses.length > 0) {
            console.error('DB is already seeded with courses.');
            return;
          }
      
          const ins=await amber.instructor.findFirst({
            where:{
               username : "har20"
            },
            select:{
              id: true
            }
          })

          console.log(ins);
          console.log(ins.id);

          const user1=await amber.user.findFirst({
            where:{
               username : "johndoe123"
            },
            select:{
              id: true
            }
          })

          const user2=await amber.user.findFirst({
            where:{
               username : "janesmith456"
            },
            select:{
              id: true
            }
          })

          await amber.course.create({ 
            data: {
              insId: ins.id,
              title: "Introduction to Machine Learning",
              imageUrl: "https://example.com/course-machine-learning.jpg",
              description: "A comprehensive introduction to machine learning concepts, including supervised and unsupervised learning.",
              prerequisites: "Basic programming knowledge, familiarity with Python",
              category: "Technology",
              subcategory: "Machine Learning",
              currency: "USD",
              price: 150,
              validityPeriod: 365,  // e.g., 365 days
              introvideo: "https://example.com/ml-intro-video.mp4",
              openToEveryone: true,
              slug: "introduction-to-machine-learning",
              certIssued: true,
              section : {
                create:[{
                    title: "Introduction to Machine Learning",
                    contents: {
                      create: [
                          {
                            type: ContentType.LECTURE,
                            title: "Introduction to Machine Learning",
                            description: "An overview of what machine learning is and how it's applied in real-world scenarios.",
                            lecture: {
                              create: {
                                videoUrl: "https://example.com/ml-intro-lecture.mp4",
                              },
                            },
                          },
                          {
                            type: ContentType.QUIZ,
                            title: "Machine Learning Basics Quiz",
                            description: "A quiz to test your understanding of basic machine learning concepts.",
                            quiz  : {
                              create:{
                                questions  : {
                                  create:[
                                      {
                                        text: "What is the capital of France?",
                                        options: {
                                          create: [
                                            { text: "Paris", isCorrect: true },
                                            { text: "London", isCorrect: false },
                                            { text: "Berlin", isCorrect: false },
                                            { text: "Madrid", isCorrect: false}
                                          ]
                                        }
                                      },
                                      {
                                        text: "Which programming language is known as the language of the web?",
                                        options: {
                                          create: [
                                            { text: "Python", isCorrect: false },
                                            { text: "JavaScript", isCorrect: true },
                                            { text: "C++", isCorrect: false },
                                            { text: "Ruby", isCorrect: false }
                                          ]
                                        }
                                      }
                                    ],
                                },
                              },
                            },
                          },
                          {
                            type: ContentType.LECTURE,
                            title: "Data Preprocessing Techniques",
                            description: "Learn various data preprocessing techniques, including cleaning, normalization, and transformation.",
                            lecture: {
                              create: {
                                videoUrl: "https://example.com/data-preprocessing-lecture.mp4",
                              },
                            },
                          },
                      ]
                    },
                  },
                  ],
              },
              purchasedBy:{
                create:[
                    {
                      userId:user1.id
                    },
                    {
                      userId:user2.id
                    }
                  ],
                },
         }, });
      }catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
    }


async function seedVideoProgress(){
  try{

    const user1=await amber.user.findFirst({
      where:{
         username : "johndoe123"
      },
      select:{
        id: true
      }
    })

    const cont=await amber.content.findFirst({
      where:{
         title : "Introduction to Machine Learning"
      },
      select:{
        id: true
      }
    })

    await amber.videoProgress.create({
      data: {
        userId: user1.id,
        contentId:cont.id,
        currentTimestamp: 605,
        markAsCompleted : true
      },
    });
  
    
}catch (error) {
console.error('Error seeding users:', error);
throw error;
}
}
 

  async function seedDatabase() {
    try {
      await seedUsers();
      await seedInstructor();
      await seedCourse();
      // await seedUserPurchases();
      await seedVideoProgress();
      
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    } finally {
      await amber.$disconnect();
    }
  }

  seedDatabase().catch((error) => {
    console.error('An unexpected error occurred during seeding:', error);
    process.exit(1);
  });