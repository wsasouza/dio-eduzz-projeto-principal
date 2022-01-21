import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Campaign} from "./Campaign";

@Entity()
export class Source extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Campaign, campaign => campaign.source_id)
    campaigns: Campaign[];
}

export default Source;